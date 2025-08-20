import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import appoinmentModel from '../models/appoinmentModel.js';
import razorpay from 'razorpay'

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //if any one is not present in the req body
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

        // Check if user already exists in database
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        // Hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //store data in userData object
        const userData = {
            name,
            email,
            password: hashedPassword
        };
            //pass userdata object to store in database
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
        //check the user present inndatabase
        const user = await userModel.findOne({email})
        //if dont found email in database
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
        //if doctor is not available 
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
        //create object with appoinment data
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
        
        //pass to appoinment model
        const newAppoinment = new appoinmentModel(appoinmentData)
        //save data in database
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
const cancelAppoinment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appoinmentId } = req.body;

    // Find appointment
    const appoinmentData = await appoinmentModel.findById(appoinmentId);

    if (!appoinmentData) {
      return res.status(404).json({ success: false, message: 'Appoinment not found' });
    }

    // Verify ownership
    if (appoinmentData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    // Mark appointment as cancelled
    await appoinmentModel.findByIdAndUpdate(appoinmentId, { cancelled: true });

    // Release doctor slot
    const { docId, slotDate, slotTime } = appoinmentData;

    // Try finding doctor by _id first, fallback to image field
    let doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      doctorData = await doctorModel.findOne({ image: docId });
    }

    if (doctorData) {
      let slots_booked = doctorData.slots_booked || {};
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
      }
      await doctorModel.findByIdAndUpdate(doctorData._id, { slots_booked });
    }

    res.json({ success: true, message: 'Appoinment cancelled' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const confirmAppoinment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appoinmentId } = req.body;

        // Get appointment
        const appoinmentData = await appoinmentModel.findById(appoinmentId);

        // Validate
        if (!appoinmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Only the user who booked it can confirm it
        if (appoinmentData.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized action' });
        }

        // Check if already cancelled
        if (appoinmentData.cancelled) {
            return res.status(400).json({ success: false, message: 'Cancelled appointment cannot be confirmed' });
        }

        // Update appointment
        await appoinmentModel.findByIdAndUpdate(appoinmentId, { isComplete: true });

        res.json({ success: true, message: 'Appointment confirmed successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




//api to make payment of appoinment
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { appoinmentId } = req.body;
    const appoinmentData = await appoinmentModel.findById(appoinmentId);

    if (!appoinmentData || appoinmentData.cancelled) {
      return res.json({ success: false, message: "Appointment cancelled or not found" });
    }

    const options = {
      amount: appoinmentData.amount * 100, // Razorpay expects amount in paise
      currency: process.env.CURRENCY || 'INR',
      receipt: appoinmentId,
    };

    const order = await razorpayInstance.orders.create(options); // ✅ FIXED LINE

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to verify payment of razorpay
const verifyRazorPay = async (req,res) =>{
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        if(orderInfo.status==='paid'){
            await appoinmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:'payment Successful'})
        }
        else{
            res.json({success:false,message:'payment Failed!'})
        }

    } catch (error) {
        console.log(error);
         res.json({ success: false, message: error.message });
    }
}



export { registerUser,loginUser,getProfile,bookAppoinment,listAppoinments, cancelAppoinment,confirmAppoinment,paymentRazorpay,verifyRazorPay};