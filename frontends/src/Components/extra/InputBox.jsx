import React from 'react'
import { FaAngleRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast'

const InputBox = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const HandleSubmit = (data) => {
        toast.success('Email sent');
        console.log(data)
        reset(); // This will clear the input after submit
    }

    return (
        <div className='w-full h-[80px] flex justify-around items-center border-b-1 bg-grey-100 text-black border-solid'>
            <div className=''>
                <h1>NEWSLETTER</h1>
                <p>Stay Upto Date</p>
            </div>
            <div className='w-[40%]'>
                <form className='flex justify-center items-center ' onSubmit={handleSubmit(HandleSubmit)}>
                    <input type='email' required placeholder='Enter Your Email..' className='input-caret rounded-l-3xl bg-white-5 w-full h-[30px] border-none focus:outline-none focus:border-none  cursor-pointer text-justify' {...register('email', { required: 'Email is required' })}/>
                    <button type="submit">
                        <FaAngleRight className='relative right-6 text-3xl  rounded-full bg-grey-200 fill-white-5'/>
                    </button>
                </form>
                {errors.email && (
                    <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
                )}
            </div>
        </div>
    )
}

export default InputBox