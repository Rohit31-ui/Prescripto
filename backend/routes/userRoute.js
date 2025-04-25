import express from 'express';
import { registerUser,loginUser, bookAppoinment, getProfile, listAppoinments, cancelAppoinment } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

//import { authUser } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Route to register a user
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile',authUser,getProfile)
//userRouter.post('/update-profile',authUser, updateProfile)

userRouter.post('/book-appoinment',authUser,bookAppoinment)

userRouter.get('/appoinments',authUser,listAppoinments)

userRouter.post('/cancel-appoinment',authUser,cancelAppoinment)




export default userRouter;
