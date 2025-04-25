import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'


//app config
const app=express()
const PORT = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())
app.use(express.json());

//api endpoint
app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor

app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)


app.get('/',(req,res)=>{
    res.send("API WORKING")
})


app.listen(PORT, ()=> console.log(`server is running at port ${PORT}`))
