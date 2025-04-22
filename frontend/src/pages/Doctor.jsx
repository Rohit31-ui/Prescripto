import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctor = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const [selected, setSelected] = useState(speciality || '');
  const [showFilter,setShowFilter]=useState(false)

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  const specialties = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  const handleSelect = (spec) => {
    if (selected === spec) {
      setSelected('');
      navigate('/doctors'); // Deselect and show all doctors
    } else {
      setSelected(spec);
      navigate(`/doctors/${spec}`); // Navigate to selected specialty
    }
  };

  return (
    <div className='md:mx-20'>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className={`flex-col sm:flex-row items-start gap-5 mt-5 ${showFilter? 'flex' : 'hidden sm:flex'}`}>
        <button className={`py-1 px-3 border rounded text-ssm transition-all sm:hidden ${showFilter? 'bg-blue-500': 'bg-white'}`}  onClick={()=>setShowFilter(prev => !prev)}>Filters</button>
        {/* Specialty Selection Section */}
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          {specialties.map((spec) => (
            <p
              key={spec}
              onClick={() => handleSelect(spec)}
              className={`w-[94vw] sm:w-auto py-1.5 pr-16 pl-5 border border-gray-300 rounded transition-all cursor-pointer 
              ${selected === spec ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctors List */}
        <div className='w-full md:mx-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {filterDoc.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appoinment/${item._id}`)}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
            >
              <img
                className='bg-blue-50 object-cover w-full md:h-56 xs:h-38 sm:h-62'
                src={item.image}
                alt='doctor'
              />
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

      </div>
    </div>
  );
};

export default Doctor;
