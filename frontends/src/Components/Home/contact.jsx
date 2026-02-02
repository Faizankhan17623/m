import {useState,useEffect} from 'react'
import Navbar from './Navbar'
import { IoIosChatboxes } from "react-icons/io";
import { FaGlobeAmericas,FaPhoneAlt } from "react-icons/fa";
import Loading from '../extra/Loading'
import OrgainezerForm from '../extra/OrgainezerForm';
import TheatrerForm from '../extra/TheatrerForm';
import Footer from './Footer';
const Contact = () => {
  
const [Switch, setSwitch] = useState('');
const [loading, setLoading] = useState(false);
const [delayedShow, setDelayedShow] = useState(false);

  useEffect(() => {
  if (Switch === 'Organizer' || Switch === 'Theater') {
    setDelayedShow(false); 
    const timer = setTimeout(() => {
      setDelayedShow(true);
    }, 1000);

    return () => clearTimeout(timer); 
  } else {
    setDelayedShow(false); 
  }
}, [Switch]);

  return (
    <div className='w-full min-h-screen text-white bg-richblack-900'>
      <Navbar />
      <div className='w-full flex justify-around items-center py-10 px-6  lg:h-screen'>
        <div className='w-[40%] max-h-fit border border-richblack-600 bg-richblack-800 rounded-lg  flex justify-evenly items-center flex-col'>
          <div className='w-full h-[100px] Options2 flex justify-center items-center '> 
            <div className='flex flex-row items-center justify-center gap-5'>
              
      <div className='w-fit h-14 flex justify-around items-center gap-1 rounded-3xl bg-richblack-400 '>
        <button
          disabled={loading}

          className={`rounded-3xl w-44 h-14 ${
            Switch === 'Organizer' ? 'bg-richblack-900 border border-richblack-900' : 'bg-richblack-400'
          }`}
          
          onClick={() => setSwitch('Organizer')}
        >
          Organizer
        </button>
        <button
          disabled={loading}
          className={`rounded-3xl w-44 h-14  ${
            Switch === 'Theater' ? 'bg-richblack-900 border border-richblack-900' : 'bg-richblack-400'
          }`}
          onClick={() => setSwitch('Theater')}
        >
          Theater
        </button>
      </div>
    </div>
          </div>

          <div className='w-full h-[300px]  border-richblack-600 bg-richblack-800 rounded-lg flex flex-col justify-evenly items-center'>
            <div className='w-[80%]'>
               <h1 className='flex gap-3 items-center font-bold text-xl'><IoIosChatboxes className='text-2xl'/>Chat With Us</h1>
               <p className='text-richblack-100'>Our Team Here at Cine Circuit is here to help Your <br /> <a href="mailto:faizankhan901152@gmail.com">Contact Us</a></p>
             </div>
             <div className='w-[80%] gap-4'>
               <h1 className='flex gap-3 items-center font-bold text-xl'><FaGlobeAmericas className='text-2xl'/>Visit Us</h1>
               <p className='text-richblack-100'>Come and Say Hello to Us at Our Office</p>
               <p className='text-richblack-100'>We will Update the Address Soon</p>
             </div>
             <div className='w-[80%]'>
               <h1 className='flex gap-3 items-center font-bold text-xl'><FaPhoneAlt className='text-xl'/>Call Us</h1>
               <p className='text-richblack-100'>Monday-Friday From 8 Am to 5 PM<br/> <a href="tel:+91 9011575978"></a>+123 456 789</p>
             </div>
          </div>
        </div>
        
        <div className='w-[50%] h-[590px] border border-richblack-600 bg-richblack-800 rounded-lg flex justify-evenly items-center flex-col Heading Bottom'>
          
          <div  className={`flex justify-center items-center flex-col gap-2 COntact_Up ${ Switch ? "hidden" : "flex"}`}>
            <h2 className='font-bold text-4xl Main_Data'>Got a Idea? We've got the skills. Let's team up</h2>
            <p className='text-xl font-mono'>Tell us more about yourself and what you're got in mind.</p> 
          </div>
          
          { loading ? ( <Loading data="relative"/>
) : Switch === 'Organizer' ? (
    delayedShow ? <><OrgainezerForm /> </> : <Loading data="relative z-10"/>
  ) : Switch === 'Theater' ? (
    delayedShow ? <><TheatrerForm  /> </> : <Loading data="relative"/>
  ) : (
    <div className='relative flex justify-center items-center w-full h-full text-3xl text-yellow-100 '>Please select an option</div>  
  )
}
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Contact