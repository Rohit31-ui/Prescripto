import express from 'express'
import { addDoctor,adminDashBoard,allDoctors,appoinmentsAdmin,loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvaibility  } from '../controllers/doctorController.js'
import { cancelAppoinment, confirmAppoinment } from '../controllers/userController.js'

const adminRouter = express.Router()
adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor)

adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-avability',authAdmin,changeAvaibility)
adminRouter.get('/appoinments',authAdmin,appoinmentsAdmin)
adminRouter.get('/dashboard',authAdmin,adminDashBoard)
adminRouter.post('/cancel-appoinment',authAdmin,cancelAppoinment);
adminRouter.post('/confirm-appoinment',authAdmin,confirmAppoinment)



export default adminRouter
