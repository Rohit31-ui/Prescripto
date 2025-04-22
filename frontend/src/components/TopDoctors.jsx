import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  // use navigate hook for smooth navigation
  const navigate = useNavigate()

  // we have used doctors from usecontxt hook
  const {doctors}=useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors.
      </p>


      <div className='w-full md:mx-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 px-3 sm:px-0'>
        {/* by adding slice we will show only starting 10 doctors, it will return array of top 10 doctord and then add map on them  */}
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            // after click on the card it will redirect to appoiment by docotor id page
            onClick={() =>  {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
          >
            {/* doctor image  */}
            <img className='bg-blue-50 object-cover w-full md:h-56 xs:h-38 sm:h-62' src={item.image} alt="doctor" />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-green-500'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* "More" Button */}
      <button
        onClick={() =>{ navigate('/doctors'); scrollTo(0,0)}} // Navigates to all doctors page
        className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-100 transition-all cursor-pointer'
      >
        More
      </button>
    </div>
  )
}

export default TopDoctors
