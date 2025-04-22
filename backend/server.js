import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'


//app config
const app=express()
const PORT = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())

//api endpoint
app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor


app.get('/',(req,res)=>{
    res.send("API WORKING")
})


app.listen(PORT, ()=> console.log(`server is running at port ${PORT}`))
