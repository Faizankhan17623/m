import React, { useEffect, useState } from 'react'
import { FaLongArrowAltDown , FaSearch  } from "react-icons/fa";
import { FaMoon } from "react-icons/fa6";
import { IoSunnyOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosSearch ,IoMdMenu } from "react-icons/io";
import '../../App.css'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { UserLogout } from '../../Services/operations/Auth'
import { toast } from 'react-hot-toast'; 

const Navbar = ({setColors,darkmode}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {isLoggedIn,image} = useSelector((state)=>state.auth)

  const [path, setpath] = useState(false)
  const [Open,Setopen] = useState(false)

  useEffect(()=>{
    const currentUrl = window.location.pathname
    setpath(currentUrl)
  },[])

  const tagsnames = {
    tag:[
      "Adventure",
      "Martial",
      "Superhero",
      "Disaster",
      "Spy Secret",
      "War",
      "Crime"
    ]
  };

  const theatreTypes = {
    types: [
      "Multiplex Theatre",
      "IMAX Theatre",
      "3D Theatre",
      "4DX Theatre",
      "Drive-in Theatre",
      "Single Screen Theatre",
      "Open Air Theatre"
    ]
  };

  const noLoggeedin ={
    data:[
      "Sign Up",
      "Login",
      "Help Center"
    ]
  }

  const color_change = ()=>{
    setColors(!darkmode)
  }

  // Fixed Logout function
  const Logout = async ()=>{
    try {
      const response = await dispatch(UserLogout())
      // console.log(response){
        toast.success("User has been logged out")
        Setopen(false) // Close the dropdown menu
        navigate('/Login')
        
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Error during logout")
    }
  }

  // Handle logout click
  const handleLogoutClick = () => {
    // e.preventDefault()
    Logout()
  }

  return (
    <div className='w-full h-20 flex justify-between items-center border-b-1 text-white bg-richblack-800'>
      <div className='py-4 pl-6'>
        <Link to="/" className=''>
          <img src={`https://res.cloudinary.com/dit2bnxnd/image/upload/v1767978923/cc41_abjbkq.png`} alt="Main logo" className='h-18 w-[250px] text-black' loading='lazy'/>
        </Link>
      </div>

      <div className= 'w-[550px]  py-4 px-3'>
        <ul className={`flex justify-between items-center h-full text-white`}>
          <Link to="/" className={`hover:text-yellow-500 text-white ${path === '/' ? 'text-yellow-200' : ''}`} >Home</Link>
          
          <div className={`hover:text-yellow-500 text-white ${path === '/Movies' ? 'text-yellow-200' : ''} flex items-center gap-1 group relative z-10`}>
            <Link  className="flex items-center gap-1" onClick={(e)=>e.preventDefault()}>
              Movies <FaLongArrowAltDown className='text-blue-300 group-hover:rotate-180'/>
            </Link>
            <div className="hidden group-hover:flex flex-col absolute top-7 left-0 bg-white shadow-lg rounded-md ">
              {tagsnames.tag.map((tag, index) => (
                <Link
                  to={`/Movies/${tag}`}
                  key={index}
                  className={`py-2 px-4 hover:bg-gray-100 whitespace-nowrap cursor-pointer border-b-2 text-white bg-gray-800`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className={`hover:text-yellow-500 text-white ${path === '/Theatres' ? 'text-yellow-200' : ''} flex items-center gap-1 group relative z-10`}>
            <Link  className="flex items-center gap-1" onClick={(e)=>e.preventDefault()}>
              Theatres <FaLongArrowAltDown className='text-blue-300 group-hover:rotate-180'/>
            </Link>
            <div className="hidden group-hover:flex flex-col absolute top-7 left-0 bg-white shadow-lg rounded-md ">
              {theatreTypes.types.map((tag, index) => (
                <Link
                  to={`/Theatres/${tag}`}
                  key={index}
                  className={`py-2 px-4 hover:bg-gray-100 whitespace-nowrap cursor-pointer border-b-2 text-white bg-gray-800`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          
          <Link to="/About" className={`hover:text-yellow-500 text-white ${path === '/About' ? 'text-yellow-200' : ''}`}>About Us</Link>
          <Link to="/Contact" className={`hover:text-yellow-500 text-white ${path === '/Contact' ? 'text-yellow-200' : ''}`}>Contact Us</Link>
        </ul>
      </div>

      <div className=' text-white w-[300px]  h-16  flex justify-center gap-5 items-center'>
        <div onClick={color_change}>
          <span><FaMoon className='text-white text-3xl'/></span>
        </div>
        <div>
          <span><MdOutlineShoppingCart className={`text-white text-3xl`} /></span>
        </div>
        <div>
          <span><IoIosSearch className={`text-white text-3xl`} /></span>
        </div> 
        
        <div className='w-[100px] h-11 flex justify-center gap-2 items-center  bg-puregreys-100 rounded-4xl' onClick={()=>Setopen(!Open)}>
          <IoMdMenu className='text-4xl'/>
          <img src={`${isLoggedIn && image ?`${image}`:"https://res.cloudinary.com/dit2bnxnd/image/upload/v1767979026/cc41_utqhtd.png"}`} alt="Logo" loading='lazy' className='w-8 rounded-4xl'/>
          <span className={`${Open ? 'flex' : 'hidden'} flex-col absolute top-[78px]  triangle-up `}></span>
          <div className={`${Open ? 'flex justify-center items-center border-t-4' : 'hidden'} flex-col gap-2  absolute top-[92px] bg-gray-800 p-2 rounded shadow-lg z-50 w-30 border-b-1 text-white font-bold`}>
            <Link to={`${isLoggedIn?"/Dashboard/my-profile":"/SignUp"}`} className='border-b-1 gap-2 lines' >
              {isLoggedIn?"Dashboard":noLoggeedin.data[0]} 
            </Link>
            
            {/* Fixed logout/login link */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogoutClick}
                className='border-b-1 gap-2 lines bg-transparent border-none text-white cursor-pointer'
              >
                Logout
              </button>
            ) : (
              <Link to="/Login" className='border-b-1 gap-2 lines'>
                {noLoggeedin.data[1]}
              </Link>
            )}
            
            <Link to="/" className=''>{noLoggeedin.data[2]}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
