import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import appoimnetImg from '../assets/appoimnet.jpg'

const MyAppoinment = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appoinments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setAppointments(data.appoinments.reverse());
       
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong while fetching appointments.");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Function to combine date and time and return a valid Date object
  const formatDateTime = (slotDate, slotTime) => {
    if (!slotDate || !slotTime) return "Invalid date/time";

    // Extract day, month, and year from slotDate
    const [day, month, year] = slotDate.split('_');
    
    // Combine the slotDate with slotTime to form a full string (e.g., "2025-04-25 10:00 AM")
    const fullDateString = `${year}-${month}-${day} ${slotTime}`;
    
    // Create a Date object from the full date string
    const formattedDate = new Date(fullDateString);

    return formattedDate.toLocaleString('en-US', {
      weekday: 'long', // Day of the week (e.g., Monday)
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const cancelAppoinment = async (appoinmentId) =>{
    try {
      console.log(appoinmentId);
  
      const response = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,  // Use POST request instead of DELETE
        { appoinmentId },  // Send appointmentId in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        toast.success('Appointment cancelled successfully.');
        // Optionally, update your appointments state to reflect the changes
        setAppointments(appointments.filter((item) => item._id !== appoinmentId));
      } else {
        toast.error('Failed to cancel appointment.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong while fetching appointments.");
    }
  }

  return (
    <div className='mx-20'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.slice(0, 3).map((item, index) => (
          <div
            className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'
            key={index}
          >
            <div>
              <img className='w-32 bg-indigo-50' src={appoimnetImg} alt={item.name} />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.speciality}</p>

              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData?.address?.line1 || "No address provided"}</p>
              <p className='text-xs'>{item.docData?.address?.line2 || "No address provided"}</p>

              <p className='text-sm mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{" "}
                {/* Format and display date/time */}
                {item.slotDate && item.slotTime ? (
                  <>{formatDateTime(item.slotDate, item.slotTime)}</>
                ) : (
                  <span>No date available</span>
                )}
              </p>
            </div>

            <div className='flex flex-col gap-2 justify-end'>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-300'>
                Pay Online
              </button>
              <button onClick={()=> cancelAppoinment(item.userId)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300'>
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppoinment;
