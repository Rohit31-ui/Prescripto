import express from 'express'
import cors from 'cors'//for cross plateform origin
import 'dotenv/config'
import connectDB from './config/db.js'//for database connection
import connectCloudinary from './config/cloudinary.js'

//router is used to handle differnt routes like admin,doctor,user
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app=express()
//prot assigning
const PORT = process.env.PORT || 4000 

//function to connet with database
connectDB()

//useful to upload images and videos
connectCloudinary()

//builtin middlewares express
app.use(express.json())
app.use(cors())
app.use(express.json());

//api endpoint
app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor

app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

//testiing 
app.get('/',(req,res)=>{
    res.send("API WORKING")
})

//server listen 
app.listen(PORT, ()=> console.log(`server is running at port ${PORT}`))
