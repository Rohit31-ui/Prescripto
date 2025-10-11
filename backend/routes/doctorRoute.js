import express from 'express';
import {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
} from '../controllers/doctorController.js';

const doctorRouter = express.Router();

// Get list of doctors (public)
doctorRouter.get('/list', doctorList);

// Doctor login
doctorRouter.post('/login', loginDoctor);

// Change doctor availability (protected - admin/doctor)
doctorRouter.post('/change-availability', changeAvailability);

// Get doctor appointments
doctorRouter.post('/appointments', appointmentsDoctor);

// Complete an appointment
doctorRouter.post('/appointment/complete', appointmentComplete);

// Cancel an appointment
doctorRouter.post('/appointment/cancel', appointmentCancel);

// Get doctor dashboard
doctorRouter.post('/dashboard', doctorDashboard);

// Get doctor profile
doctorRouter.post('/profile', doctorProfile);

// Update doctor profile
doctorRouter.post('/profile/update', updateDoctorProfile);

export default doctorRouter;
