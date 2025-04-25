import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import appoinmentModel from '../models/appoinmentModel.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

    
};

//API for user login
const loginUser = async (req,res) => {
    try {
        
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if(!user) {
           return res.json({success:false,message: 'user does not exist'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
           res.json({success:false,message:"Invalid credentials"}) 
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to get user profile data
const getProfile = async (req, res) => {
    try {
        // Access userId from req.userId (set by middleware)
        const userId = req.userId;

        const userData = await userModel.findById(userId).select('-password');
        
        res.json({ success: true, userData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api to update user profile

// const updateProfile = async (req,res) =>{

//     try {
//         const userId = req.userId;
//         const {name,phone,address,dob,gender} =req.body

//         if(!name || !phone || !dob || !gender){
//             return res.json({success:false,message:"Data Missing"})
//         }

//         await userModel.findByIdAndUpdate(userId,{name,phone,address,dob,gender}) 

//         res.json({success:true,message:"Profile Updated"})
        

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }





//API to book appoinment

const bookAppoinment = async (req,res) => {
    try {
        const userId = req.userId;
        const {docId,slotDate,slotTime} = req.body
        const docData = await doctorModel.findOne({ image: docId }).select('-password')

        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'})

        }

        let slots_booked = docData.slots_booked 

        //checking for slots avaibility
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'slot not available'})

            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]= []
            slots_booked[slotDate].push(slotTime)
        }


        const userData = await userModel.findById(userId).select('-password')
        
        delete docData.slots_booked

        const appoinmentData = {
            userId,
            docId,
            userdata: userData,  
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }
        

        const newAppoinment = new appoinmentModel(appoinmentData)

        await newAppoinment.save()

        //save new slots data in docData
        await doctorModel.findOneAndUpdate({ image: docId }, { slots_booked });

        res.json({success:true,message:"Appoinment Booked"})



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//api to get user appoinments for frontend 
const listAppoinments = async (req,res) => {
    try {
        const userId = req.userId;
        const appoinments = await appoinmentModel.find({userId})

        res.json({success:true,appoinments})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//api to cancel the appoinments 
const cancelAppoinment = async (req,res) =>{

    try {
        const userId = req.userId;
        const {appoinmentId} = req.body

        const appoinmentData = await appoinmentModel.findById(userId)

        // verify appoinment user
        if(appoinmentData.userId !=userId){
            return res.json({success:false,message:'Unautherised action'})
        }

        await appoinmentModel.findByIdAndUpdate(userId,{cancelled:true})

        // releasing doctor slot
        const {docId, slotDate , slotTime} = appoinmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e!== slotTime )

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appoiment cancelled'})

        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser,loginUser,getProfile,bookAppoinment,listAppoinments, cancelAppoinment};
