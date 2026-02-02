import  {  useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import { useNavigate } from 'react-router-dom'
import Loader from '../extra/Loading'
import {UserLogin,findemail} from '../../Services/operations/Auth'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
// import { useSelector } from 'react-redux';


const User = () => {

   const [showPass, setShowPass] = useState(false)
      const [Pass,setpass] = useState("")
      const [loading,setLoading] = useState(false)
      const [username,setusername] = useState("")
        const [names, setNames] = useState(""); // "" | "available" | "taken"
        const [errorMessage, setErrorMessage] = useState('');
      
      const navigate = useNavigate()
      const dispatch = useDispatch()
  
      const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm()

    useEffect(()=>{
      if(!username) return 
      const Handler = setTimeout(async()=>{
              const toastId = toast.loading("Checking username...");
        try{
          const Response = await dispatch(findemail(username))
            if (Response?.success) {
              setNames("This Email is not Available");
              toast.error("Please Check Your Email")
          } else {
          setNames("")
        }
        }catch(error){
            console.error("Error in username check:", error);
        setNames("");
        }finally {
        toast.dismiss(toastId);
      }
      },300)
      return () => clearTimeout(Handler)
    },[username])
    //   const password = watch('Password')
    
      const onsubmit = async (data) => {
        if(names === " Taken") {
           let errorMsg = "Please fix the following issues: ";
      setErrorMessage(errorMsg);
      return;
        }
        setLoading(true)
        try{
          const Response = await dispatch(UserLogin(data.Email,data.Password,navigate))
          // console.log(Response)
          if(Response?.success){
            toast.success("user is loged in ")
            navigate("/Dashboard/my-profile")

          }
        setLoading(false)
        }catch(error){
          toast.error(error.message)
          console.log(error)
          console.log(error.message)
          // toast.error("the Password is not correct")
        }
      }
    

       if(loading){
          return (
            <div className='w-full h-full flex flex-col'>
              <div className='flex-1 flex justify-center items-center text-white'>
                <Loader/>
              </div>
            </div>
          )
        }
  const nameAsteriskColor = names === "available" ? "text-caribgreen-500" : "text-red-500";

     return (
        <form
          onSubmit={handleSubmit(onsubmit)}
          className='w-full h-full mx-auto p-8 rounded-2xl  shadow-lg space-y-8 mt-8 '
        >
           {errorMessage && <span className="text-red-500">{errorMessage}</span>}

           {names && (
        <span className={`flex font-semibold  ${names === "Available" ? "text-red-500" : " text-caribgreen-500" }`}>
          No user Exists With This Email id
        </span>
      )}
    
          {/* Email */}
          <div>
            <label className="block  mb-2 font-semibold" htmlFor="Email">
               First Name <span className={nameAsteriskColor}>*</span>
              {errors.Email && <span className="text-red-600 text-sm"> {errors.Email.message}</span>}
            </label>
            <input
              type="email"
              {...register("Email", { required: "Email is required" })}
              onChange={(e)=>setusername(e.target.value)}
              className={`w-full p-3  rounded-lg form-style outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.Email && "border-red-500"}`}
              placeholder="Enter Your Email Address"
               autoComplete="email"
            />
           
          </div>
    
          {/* Phone */}
      
    
          {/* Passwords */}
          <div className="flex gap-4 Pass">
            {/* Password */}
            <div className="flex-1 relative">
              <label className="block  mb-2 font-semibold" htmlFor="Password">
                Password <span className="text-red-500">*</span>  {errors.Password && (
                <span className="text-red-600 text-sm">{errors.Password.message}</span>
              )}
              </label>
              <input
                type={showPass ? "text" : "password"}
                {...register("Password", {
                  required: "Password is required",
                  minLength: {
                    value: 2,
                    message: "Password must be exactly 6 characters"
                  },
                  maxLength: {
                    value: 10,
                    message: "Password must be exactly 10 characters"
                  }
                })}
                className={`w-full p-3 pr-10  rounded-lg outline-none form-style focus:ring-2 focus:ring-blue-400 transition ${errors.Password && "border-red-500"}`}
                placeholder="Enter Your Password"
                onChange={(e)=>setpass(e.target.value)}
                  autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-12 transform -translate-y-1/2 text-2xl "
                tabIndex={-1}
                onClick={() => setShowPass(s => !s)}
              >
                {showPass ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}
              </button>
              
            </div>
            {/* Confirm Password */}
            
          </div>
          <div className='w-full flex flex-end justify-end items-end Forgot'>
            <p> <a href="/Forgot-Password" className='text-blue-200'>Forgot Password</a>  </p>
          </div>
    
          {/* Submit button */}
            {loading ? (
            <button
              type="button"
              className="w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-lg mt-4 text-lg transition duration-200 shadow flex justify-center items-center"
              disabled
            >
              <Loader />
              <span className="ml-2">Processing...</span>
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-yellow-200 cursor-pointer Org_Btns hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-4 text-lg transition duration-200 shadow"
            >
              Submit
            </button>
          )}
        </form>
      )
}

export default User
