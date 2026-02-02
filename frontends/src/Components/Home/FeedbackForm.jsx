import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import CountryCode from '../../data/CountryCode.json'
import toast from 'react-hot-toast'
const FeedbackForm = () => {

    const Submitdata = (data) => {
      toast.success('Submitted')
        console.log("Form Data - ", data);
    }

    const { register, handleSubmit,reset, formState: { errors,isSubmitSuccessful } } = useForm();

    const [loading,setLoading] = useState(false)

    useEffect(()=>{
      setLoading(true)
      if(isSubmitSuccessful){
        reset({
          first:"",
          last:"",
          Email:"",
          CountryCode:"",
          Number:"",
          Messages:""
        })
      }
      setLoading(false)

    },[reset,isSubmitSuccessful])
  return (
    <form onSubmit={handleSubmit(Submitdata)}>
        <div className='w-full h-[700px]  flex justify-center items-center'>
          <div className='w-[510px]  h-[90%] flex justify-items-start items-center flex-col'>
            
            <div className='w-full flex justify-center items-center flex-col Form_Heading gap-3'>
              <h1 className='text-5xl'>Get in Touch </h1>
              <p>we'd love to hear from you, please fill out this form</p>
            </div>

            <div className='Main_Form w-full'>
              {/* This div is for creating a form */}
              <div className='flex justify-center items-center  w-full'>
                <label htmlFor="first" className='lable-style flex flex-col w-full gap-3'>
                  First Name
                  <input type="text"  placeholder='Enter Your First Name'  name='first' className="form-style w-[240px] bg-richblack-500 focus:bg-richblack-500 focus:outline-none focus:ring-0 rounded-xl h-[50px] Names" required {...register("firstName", { required: "First name is required" })}/>
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                  )}
                  </label>
                <label htmlFor="last" className='flex flex-col w-full gap-3 lable-style'>
                  Last Name
                  <input type="text" required placeholder='Enter Your Last Name'  name='last' className="form-style w-[240px] bg-richblack-500 focus:bg-richblack-500 focus:outline-none focus:ring-0 rounded-xl h-[50px] Names"  {...register("lastName", { required: "Last name is required" })}/>
                                {errors.lastName && (
  <span className="text-red-500 text-sm">{errors.lastName.message}</span>
)}
                </label>
              </div>
              
              <div className='flex flex-col form_email h-24'>
                <label htmlFor="Email" className='flex flex-col gap-3 lable-style'>
                  Email Address  {errors.Email && (
  <span className="text-red-500 text-sm flex">{errors.Email.message}</span>
)}
                  <input type="email" name="Email" required   className='form-style Names w-[500px] bg-richblack-500 rounded-2xl h-[50px]'placeholder='Enter Your Email'  {...register("Email", { required: "Email is required" })}/>
                </label>
              </div>


              <div className='flex justify-center items-center w-fit gap-3'>
                <div className='w-[30%]  flex flex-col gap-2'>
                  <label htmlFor="CountryCode" className='lable-style'>Phone Number</label>
                  <select required name="CountryCode"  className='w-[92%] bg-richblack-400 rounded-2xl form-style'  {...register("countrycode", { required: "Country Code is required" })}>
                    {CountryCode.map((data,index)=>(
                      <option required value={data.code} id={index} className='w-[55px] form-style'  >
                        {data.code} - {data.country}
                      </option>
                    ))}
                                    {errors.countrycode && (
  <span className="text-red-500 text-sm">{errors.countrycode.message}</span>
)}
                  </select>
                  
                </div>
                <div>
                  <label htmlFor="Number" className='lable-style'>
                    <input type="tel"required name="Number"  minLength={10}
    maxLength={10}  className='form-style w-[390px] h-[50px] rounded-2xl bg-richblack-500 Names text-white Number_inputs' placeholder='12345 67890' {...register("number", {
      required: "Phone Number is required",
      minLength: {
        value: 10,
        message: "Phone number must be 10 digits",
      },
      maxLength: {
        value: 10,
        message: "Phone number must be 10 digits",
      }

    })}/>
    {errors.number && (
  <span className="text-red-500 text-sm flex">{errors.number.message}</span>)}
                  </label>
                </div>
              </div>
              <div className=' w-full flex flex-col Message_Btn gap-3'>
                <label htmlFor="Messages" className='text-3xl lable-style'>Message</label>
                <textarea name="Messages"  required cols={4} rows={4} placeholder="Enter Your Message" className='form-style Messages bg-richblack-500 rounded-2xl z-100'  {...register("Message", { required: "Message is required" })}></textarea>
              {errors.Message && (
  <span className="text-red-500 text-sm">{errors.Message.message}</span>)}
              </div>

              <button className='z-100 w-full flex justify-center items-center border Btns rounded-2xl bg-yellow-50 text-richblack-900' type='submit' disabled={loading}>Send Messsage</button>

            </div>
          </div>
        </div>
    </form>
  )
}

export default FeedbackForm



// 35k7t93