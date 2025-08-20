import mongoose from "mongoose";//mongoose in odm for connecting mongodb 

const connectDB = async () =>{

    mongoose.connection.on('connected', () => console.log("Database connected"))
    
    //method to connect with mongoose database
    await mongoose.connect(`${process.env.MONGODB_URI}`)

}

export default connectDB