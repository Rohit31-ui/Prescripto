import React, { useState } from 'react'
import {assets} from '../assets/frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

    // all navigaing data
const navData=[
    {id:1,link:"HOME",path:"/"},
    {id:2,link:"All Doctors",path:"/doctors"},
    {id:3,link:"About",path:"/about"},
    {id:4,link:"contact",path:"/contact"}
]

    const navigate=useNavigate();
    //to handle menu button
    const [showMenu,setShowMenu]=useState(false);
    //to handle login button 
    const [token,setToken]=useState(true);


  return (
    <div className='md:mx-20 flex justify-between items-center text-sm py-4 mb-5 border-b border-b-gray-400 mx-10'>
       {/* logo image */}
        <img onClick={()=> navigate('/')} src={assets.logo} alt="logo image" className='w-44 cursor-pointer'/>

        <ul className='hidden md:flex items-start gap-6 font-medium'>
            {/* mapping navdata items  */}
    {navData.map(({ id, link, path }) => (
        <li key={id} className='font-semibold uppercase py-1 hover:underline'>
            <NavLink to={path}>
                {link}
            </NavLink>
        </li>
    ))}
</ul>


        <div className='flex items-center gap-4'>

            {
                // if token true then show dropdown else show create account page
                token? 
                 //dropdown on hover after profile image
                <div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img className='w-8 rounded-full' src={assets.profile_pic} alt="profile picture"/>
                    <img className='w-2.5 ' src={assets.dropdown_icon} alt="dropdown icon" />
                    <div className='top-0 absolute right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 '>
                            <p onClick={()=> navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=> navigate('my-appoinments')} className='hover:text-black cursor-pointer'>My Appoinments</p>
                            <p onClick={()=> setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div> :  
                //create account button
                <button onClick={()=> navigate('/login')} className='px-8 py-3 border bg-blue-400 text-white rounded-full font-light hidden md:block cursor-pointer'>Create account</button>
            }

            <img onClick={()=> setShowMenu(true)} src={assets.menu_icon} className='w-6 md:hidden cursor-pointer' alt="" />
            {/* Mobile menu */}

            <div className={` ${showMenu? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36 ' src={assets.logo} alt="" />
                    <img className='w-7 cursor-pointer' src={assets.cross_icon} onClick={()=>setShowMenu(false)} alt="" />
                </div>

                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink className='px-4 py-2 rounded inline-block' onClick={()=> setShowMenu(false)} to='/'>HOME</NavLink>
                    <NavLink className='px-4 py-2 rounded inline-block' onClick={()=> setShowMenu(false)} to='/doctors'>ALL DOCTORS</NavLink>
                    <NavLink className='px-4 py-2 rounded inline-block' onClick={()=> setShowMenu(false)} to='/about'>ABOUT</NavLink>
                    <NavLink className='px-4 py-2 rounded inline-block' onClick={()=> setShowMenu(false)} to='/contact'>CONTACT</NavLink>
                </ul>
            </div>

        </div>
    </div>
  )
}

export default Navbar
