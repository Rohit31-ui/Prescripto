import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctor = () => {

      const { speciality } = useParams();
      const navigate = useNavigate();
      //state to to handle specialty filter
      const [filterDoc, setFilterDoc] = useState([]);

      //doctors from context
      const { doctors } = useContext(AppContext);

      //change of color on selected
      const [selected, setSelected] = useState(speciality || '');
      //
      const [showFilter, setShowFilter] = useState(false);

      //filter based on search
      const [searchTerm, setSearchTerm] = useState('');

      //to handle filter based on experience
      const [experience, setExperience] = useState('');

  useEffect(() => {
    let filtered = doctors;

    // Filter by speciality if selected
    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality);
    }

    // Filter by search term (case-insensitive)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    //filter based o experience
    if (experience) {
    const years = parseInt(experience);
    filtered = filtered.filter(doc => parseInt(doc.experience) >= years);
    }

    setFilterDoc(filtered);
  }, [doctors, speciality, searchTerm,experience]);

  //speciality array
  const specialties = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  //function to handle selected speciality
  const handleSelect = (spec) => {
    //if double click on same then remove bg-color and show all doctors again
    if (selected === spec) {
      setSelected('');
      navigate('/doctors');
      //else add bg-color and show only filtered doctors
    } else {
      setSelected(spec);
      navigate(`/doctors/${spec}`);
    }
  };

  return (
    <div className='md:mx-20'>
      <div className="flex justify-center items-center mt-4">
        {/* search doctor by name */}
        <input
          type="text"
          placeholder="Search doctor by name"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <p className='text-gray-600 mt-3'>Browse through the doctors specialist.</p>

      {/* left side includes filters */}
      <div className={`${showFilter ? 'flex' : 'hidden sm:flex'} flex-col sm:flex-row items-start gap-5 mt-5`}>
        <button
          className={`py-1 px-3 border rounded text-ssm transition-all sm:hidden ${showFilter ? 'bg-blue-500' : 'bg-white'}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        <div className='flex flex-col justify-center items-center gap-5'>

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
        
        {/* to filter doctor based on experience */}
        <div className="mt-4">
          <label className="text-sm text-gray-700 mr-2">Filter Doctors based on experience:</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="px-3 mt-2 cursor-pointer py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="1">1+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>
        </div>


        {/* Doctors List */}
        <div className='w-full md:mx-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5'>
          {filterDoc.length === 0 ? (
            //if filtered length==0 then show no doctors found
            <p className="col-span-full text-center text-gray-500">No doctors found.</p>
          ) : (
            //else if filtered length!=0 then show doctors
            filterDoc.map((item) => (
              <div
                key={item._id}
                //onclick navigate to appoinment booking page
                onClick={() => navigate(`/appoinment/${item._id}`)}
                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
              >
                {/* dcotor image */}
                <img
                  className='bg-blue-50 object-cover w-full md:h-56 xs:h-38 sm:h-62'
                  src={item.image}
                  alt='doctor'
                />

                <div className='p-4'>
                  {/* Available tag */}
                  <div className='flex items-center gap-2 text-sm text-green-500'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    <p>Available</p>
                  </div>
                  {/* doctor name,experience,speciality */}
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.experience}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctor;