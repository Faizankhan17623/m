import InputBox from '../extra/InputBox'
import { FaGooglePlay,FaAppStore,FaLinkedin,FaInstagram ,FaTwitter ,FaGithub ,FaRegCopyright,FaHeart  } from "react-icons/fa";
// import SD from '../../assets/Logo/sd-removebg-preview.png'
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa6";

const Footer = () => {
  return (
  <div className='w-full h-max'>
    <InputBox/>
    <div className='w-full h-[400px]  text-white flex flex-col justify-end'>
      {/* This div is forr thee footeer first section  */}
      <div className='flex justify-evenly items-center w-full h-[300px]'>
        
       
        <div className='flex flex-col w-[300px] h-[300px] justify-center items-center gap-4'>
          <img src={'https://res.cloudinary.com/dit2bnxnd/image/upload/v1767978923/cc41_abjbkq.png'} alt="This is the logo" className='h-[100px] w-full'/>
          <p>This is a Ticket Booking Website Project that is done by Faizan Khan. Please like the website and if there is anything you do not like, please write to us.</p>
          <div className='flex items-center justify-around gap-5 group relative'>
            <span className='absolute -top-15 left-0 w-[300px] h-[50px] border bg-white text-black px-2 py-1 rounded shadow-lg hidden group-hover:block'>
              Our Team is Working on making this Project a mobile app, please bear with us
            </span>
            <button className='rounded-md BUTTON_DESIGN bg-grey-300 gap-3 flex justify-center items-center text-black'><FaGooglePlay/>Play Store</button>
            <button className='rounded-md BUTTON_DESIGN bg-grey-300 gap-3 flex justify-center items-center text-black'><FaAppStore/>App Store</button>
          </div>
        </div>

        
        <div className='flex flex-col gap-3'>
          <h1>COMPANY</h1>
          <a href="/">About Us</a>
          <a href="/">Legal Information</a>
          <a href="/">Contact Us</a>
          <a href="/">Blogs</a>
        </div>


        <div className='flex flex-col gap-3'>
          <h1>HELP CENTER</h1>
          <a href="/">BECOME AN ORGAAINEZER</a>
          <a href="/">BECOME AN THEATRER</a>
          <a href="/">COMPLAENT</a>
          <a href="/">CARRERS</a>
          <a href="mailto:Faizankhan901152@gmail.com">Report a Bug</a>
        </div>

        <div className='flex flex-col gap-3'>
          <h1>CONTACT INFO</h1>
          <a href="tel:+91 9011575978">Phone</a>
          <a href="mailto:Faizankhan901152@gmail.com">Email:Contact@gmail.com</a>
          <p>Made by Faizan khan</p>
          
          <div className='flex gap-4'>
            <FaLinkedin className='text-2xl fill-blue-100'/>
            <FaInstagram className='text-2xl fill-pink-300'/>
            <FaTwitter className='text-2xl fill-blue-500'/>
            <a href="https://github.com/Faizankhan17623?tab=repositories"><FaGithub className='text-2xl '/></a>
          </div>
          <div className='w-full  h-10 flex justify-evenly items-center group relative'>
            <span className='absolute -top-15 left-0 w-[250px] h-[50px] border bg-white text-black px-2 py-1 Contentt rounded shadow-lg hidden group-hover:block'>We are Still Working on this it will start soon</span>
            <button className='Day_Night rounded-xl bg-white hover:text-orange-300'><IoIosSunny className='text-Orange-100 text-2xl hover:text-orange-300'/></button>
            <button className='Day_Night rounded-xl bg-richblack-500'><FaMoon className='text-white text-2xl '/></button>
          </div>
        </div>

      </div>

      {/* Thiis is for thee second section of thee footeer */}
      <div className='w-full h-20 flex justify-around items-center border-t-4'>
        <div className='flex justify-center items-center gap-2'>
          <FaRegCopyright /> 2025 Cine Circuit <span>|</span> All Rights Reserved With the Developer
        </div>
        |
        <div className='flex justify-center items-center gap-2'>
          Made with <FaHeart className='fill-red-500'/> by Faizan Khan
        </div>
      </div>

    </div>
  </div>
  )
}

export default Footer