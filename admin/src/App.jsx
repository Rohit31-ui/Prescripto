import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppoinments from './pages/Admin/AllAppoinments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';

const App = () => {

  const {aToken} = useContext(AdminContext)


  return aToken? (
    <div className='bg-[#F8F9FD]'>
     <ToastContainer/>
     <Navbar/>
     <div className='flex items-start'>
      <SideBar/>
      <Routes>
        <Route path="/" element={<></>}/>
        <Route path='/admin-dashboard' element={<Dashboard/>} />
        <Route path='/all-appoinments' element={<AllAppoinments/>} />
        <Route path='/add-doctor' element={<AddDoctor/>} />
        <Route path='/doctor-list' element={<DoctorsList/>} />
      </Routes>
     </div>
     
    </div>
  ) : <>
   <Login/>
   <ToastContainer/>
  </>
}

export default App
