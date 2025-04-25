import { createContext, useEffect, useState } from "react";
import React from "react";
import { doctors } from "../assets/frontend/assets";
import axios from 'axios'
import { toast } from "react-toastify";

// Create Context
export const AppContext = createContext();

// Context Provider Component
const AppContextProvider = ({ children }) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [doctor,setDoctors] = useState([])

  const [userData,setUserData] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token') : false);

  
  const getDoctorsData = async () =>{
    
    try {
      
      const {data}= await axios.get(backendUrl + '/api/doctor/list' )
      if(data.success){
        setDoctors(data.doctors)
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // const loadProfileData = async () => {
  //   try {
      
  //     const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})

  //     if(data.success){
  //       setUserData(data.userData)

  //     }
  //     else{
  //       toast.error(data.message)
  //     }



  //   } catch (error) {
  //     console.log(error)
  //     toast.error(error.message)
  //   }
  // }


  
  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,setUserData
  };

  useEffect(()=>{
    getDoctorsData()
  },[])

  // useEffect(()=>{
  //   if(token){
  //     loadProfileData()
  //   }
  //   else{
  //     setUserData(false)
  //   }
  // },[token])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
