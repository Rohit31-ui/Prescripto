import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import {assets} from '../../assets/admin/assets'
const DoctorsList = () => {

  const {doctors , aToken,getAllDoctors,changeAvaibility } = useContext(AdminContext) 

  useEffect(()=>{
    if(aToken){
      getAllDoctors()
    }
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer p-5' key={index}>
              <img className='w-36 h-36 bg-indigo-50 group-hover:bg-[#5f6FFF] transition-all duration-500' src={assets.doctor_icon} alt="" />
              <div>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='m-2 flex items-center justify-items-start gap-1 text-sm'>
                  <input onChange={()=>changeAvaibility (item._id)} type="checkbox" checked={item.available}/>
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
