import {  useState,useEffect } from 'react'
import CountryCodee from '../../data/CountryCode.json'
import { useForm } from 'react-hook-form'
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import { useNavigate } from 'react-router-dom'
import Loader from '../extra/Loading'
import { FindUserName, NumberFinder, findemail,sendOtp } from '../../Services/operations/Auth';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
// import {Creation} from '../../Services/operations/orgainezer'

const Org = () => {
  const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [Pass,setpass] = useState("")
    const [ConfirmPass,setConfirmPass] = useState("")
    const [samePass, setSamePass] = useState(false);
    const [names, setNames] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [numbers, setNumbers] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [Loading,setloading] = useState(false)
    const [Data,setData] = useState(null)
    const [mail, setMail] = useState("");
    
    

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors }
    } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const password = watch('Password');
    const confirmPass = watch('ConfirmPass');

     useEffect(() => {
        setSamePass(confirmPass === password && password > 0); // Fixed: Check length
      }, [password, confirmPass]);


       useEffect(() => {
          if (!firstName || !lastName) {
            setNames("");
            return;
          }
          const handler = setTimeout(async () => {
            const toastId = toast.loading("Checking username...");
            try {
              const response = await dispatch(FindUserName(firstName, lastName)); // Fixed: response
              // console.log("Username check response:", response);
              if (response?.success) {
                setNames("available"); // Lowercase
              } else {
                setNames("taken");
              }
            } catch (error) {
              console.error("Error in username check:", error);
              setNames("");
            } finally {
              toast.dismiss(toastId);
            }
          }, 500);
          return () => clearTimeout(handler);
        }, [firstName, lastName]); // Added dispatch


        useEffect(() => {
            if (!email) {
              setEmails("");
              return;
            }
            const handler = setTimeout(async () => {
              const toastId = toast.loading("Checking email...");
              try {
                const response = await dispatch(findemail(email)); // Fixed: response
                // console.log("Email check response:", response); // Fixed: label
                if (response?.success) {
                  setEmails("available");
                } else {
                  setEmails("taken");
                }
              } catch (error) {
                console.error("Error in email check:", error);
                setEmails("");
              } finally {
                toast.dismiss(toastId);
              }
            }, 500);
            return () => clearTimeout(handler);
          }, [email]); // Added dispatch

           useEffect(() => {
    // console.log(phoneNumber)
// console.log(typeof phoneNumber)

    if (!phoneNumber) {
      setNumbers("");
      return;
    }
    const handler = setTimeout(async () => {
      const toastId = toast.loading("Checking number..."); // Fixed: message
      try {
        const response = await dispatch(NumberFinder(phoneNumber)); // Fixed: response
        // console.log("Number check response:", response); // Fixed: label
        if (response?.success) {
          setNumbers("available");
        } else {
          setNumbers("taken");
        }
      } catch (error) {
        console.error("Error in number check:", error); // Fixed: label
        setNumbers("");
      } finally {
        toast.dismiss(toastId);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [phoneNumber]); // Added dispatch

    const sendOTP = async ()=>{
        if (!email) return;

      const toastId = toast.loading('Loading... ')
      try {
        setloading(true)
        const Response = await dispatch(sendOtp(email))
        // console.log("OTP check response:", Response); // Fixed: label
        if (Response?.success) {
          toast.success('OTP sent successfully');
        return Response.data.data.data; // Return the OTP directly
        } else {
           toast.error(Response.error || 'OTP send failed');
        return null;
        }
        // console.log("This is the otp",otp)
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error('Something went wrong');;
      } finally {
        setloading(false)
        toast.dismiss(toastId);
      }
    }



    const onsubmit = async (data) => {
         if (names === "taken" || emails === "taken" || numbers === "taken") {
      let errorMsg = "Please fix the following issues: ";
      if (names === "taken") errorMsg += "Username is taken. ";
      if (emails === "taken") errorMsg += "Email is taken. ";
      if (numbers === "taken") errorMsg += "Number is taken. ";
      setErrorMessage(errorMsg);
      return;
    }

      try{
        const finalData = {
      firstName: data.First,
      lastName: data.Last,
      email: data.Email,
      countryCode: data.CountryCode,
      phoneNumber: data.Number,
      password: data.Password,
      confirmPassword: data.ConfirmPass,
       usertype:"Organizer"
    };
      // console.log("Full data object:", finalData); 
       setData(finalData)
       setMail(data.Email)
         const otp = await sendOTP(data.Email); // Get OTP directly
      if (!otp) return; // Stop if OTP send fails

      //  setShowOtp(true)
       navigate("/OTP",{
        state: {
            otp,   
            mail: data.Email,
            data: finalData,
  },
})
// setShowOtp(false)
      }catch(error){
        console.error("User creation error:", error);
      setErrorMessage(error.message || "An error occurred during signup.");
      }
      // console.log("This is the org form data", data)
    }

  if(Loading){
    return (
      <div className='w-full h-full flex flex-col'>
        <div className='flex-1 flex justify-center items-center text-white'>
          <Loader data="text-4xl border left-100  top-50 h-80"/>
        </div>
      </div>
    )
  }

  


     const nameAsteriskColor = names === "available" ? "text-caribgreen-500" : "text-red-500";
  const emailAsteriskColor = emails === "available" ? "text-caribgreen-500" : "text-red-500";
  const numberAsteriskColor = numbers === "available" ? "text-caribgreen-500" : "text-red-500";

   return (
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full h-max rounded-2xl shadow-lg space-y-8 bg-richblack-800"
      >
  {errorMessage && <span className="text-red-500">{errorMessage}</span>}

           {names && (
        <span className={`flex font-semibold ${names === "available" ? "text-caribgreen-500" : "text-red-500"}`}>
          This username is {names}.
        </span>
      )}

        {/* Name Row */}
        <div className="flex gap-4 ">
          {/* First Name */}
          <div className="flex-1">
            <label className="block  mb-2 font-semibold" htmlFor="First">
              First Name <span className={nameAsteriskColor}>*</span> 
               {errors.First && <span className="text-red-600 text-sm"> {errors.First.message}</span>}
            </label>
            <input
              type="text"
              {...register("First", { required: "Required"})}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full p-3  rounded-lg outline-none focus:ring-2 focus:ring-blue-400 form-style transition ${errors.First && "border-red-500"}`}
              placeholder="Enter First Name"
            />
          
          </div>
          {/* Last Name */}
          <div className="flex-1">
            <label className="block mb-2 font-semibold" htmlFor="Last">
              Last Name <span className={nameAsteriskColor}>*</span>
            {errors.Last && <span className="text-red-600 text-sm"> {errors.Last.message}</span>}
            </label>
            <input
              type="text"
              {...register("Last", { required: "Required"})}
            onChange={(e) => setLastName(e.target.value)}

              className={`w-full p-3  rounded-lg outline-none focus:ring-2 form-style focus:ring-blue-400 transition ${errors.Last && "border-red-500"}`}
              placeholder="Enter Last Name"
            />
            
          </div>
        </div>
  
        {/* Email */}
        <div className='EmailSign'>
          <label className="block  mb-2 font-semibold" htmlFor="Email">
            Email Address <span className={emailAsteriskColor}>*</span>
          {errors.Email && <span className="text-red-600 text-sm"> {errors.Email.message}</span>}
           {emails && (
          <span className={`flex font-semibold mb-2 ${emails === "available" ? "text-caribgreen-500" : "text-red-500"}`}>
            This email is {emails}.
          </span>
        )}
          </label>
          <input
            type="email"
            {...register("Email", { required: "Required" })}
          onChange={(e) => setEmail(e.target.value)}

            className={`w-full p-3  rounded-lg form-style outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.Email && "border-red-500"}`}
            placeholder="Enter Your Email Address"
          />
          
        </div>
  
        {/* Phone */}
        <div className="flex gap-4 Country">
          {/* Country Code */}
          <div className="w-32">
            <label className="block  mb-2 font-semibold" htmlFor="CountryCode">
              Country Code <span className="text-red-500">*</span>
            </label>
            <select
              {...register("CountryCode")}
              className={`p-3 w-30 bg-richblack-600 h-11 form-style  rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.CountryCode && "border-red-500"}`}
              defaultValue=""
            >
              <option value="" disabled>Select Your Country Code</option>
              {CountryCodee.map((data, i) => (
                <option key={i} value={data.code}>{data.code} - {data.country}</option>
              ))}
            </select>
            {/* {errors.CountryCode && (
              <span className="text-red-600 text-sm">{errors.CountryCode.message}</span>
            )} */}
          </div>
          {/* Number */}
          <div className="flex-1">
            <label className="block  mb-2 font-semibold" htmlFor="Number">
              Mobile Number <span className={numberAsteriskColor}>*</span>
            {errors.Number && <span className="text-red-600 text-sm"> {errors.Number.message}</span>}
            {numbers && (
            <span className={`flex font-semibold mb-2 ${numbers === "available" ? "text-caribgreen-500" : "text-red-500"}`}>
              This number is {numbers}.
            </span>
          )}
            </label>
            <input
              type="tel"
              maxLength={10}
              {...register("Number", {
                required: "Required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Number must be exactly 10 digits"
                }
              })}
              onChange={(e) =>setPhoneNumber(e.target.value)}
              className={`w-[300px] p-3  rounded-lg outline-none form-style focus:ring-2 focus:ring-blue-400 transition ${errors.Number && "border-red-500"}`}
              placeholder="Enter Your 10-digit Mobile Number"
            />
            
          </div>
        </div>
  
        {/* Passwords */}
        <div className="flex gap-4 Password">
          {/* Password */}
          <div className="flex-1 relative">
            <label className="block  mb-2 font-semibold" htmlFor="Password">
              Password <span className={`${samePass ? "text-caribgreen-500" : "text-red-500"}`}>*</span>
            {errors.Password && <span className="text-red-600 text-sm"> {errors.Password.message}</span>}
            </label>
            <input
              type={showPass ? "text" : "password"}
              {...register("Password", {
                required: "Required",
                minLength: {
                  value: 2,
                  message: "Password must be exactly 2 characters"
                },
                maxLength: {
                  value: 10,
                  message: "Password must be exactly 10 characters"
                }
              })}
              className={`w-full p-3 pr-10  rounded-lg outline-none form-style focus:ring-2 focus:ring-blue-400 transition ${errors.Password && "border-red-500"}`}
              placeholder="Enter Your Password"
              onChange={(e)=>setpass(e.target.value)}
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
          <div className="flex-1 relative">
            <label className="block  mb-2 font-semibold" htmlFor="ConfirmPass">
              Confirm Password <span className={`${samePass ? "text-caribgreen-500" : "text-red-500"}`}>*</span>
            {errors.ConfirmPass && <span className="text-red-600 text-sm"> {errors.ConfirmPass.message}</span>}
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              {...register("ConfirmPass", {
                required: "Required",
                minLength: {
                  value: 2,
                  message: "Password must be exactly 2 characters"
                },
                maxLength: {
                  value: 10,
                  message: "Password must be exactly 10 characters"
                },
                validate: (val) =>
                  val === password || "Passwords do not match"
              })}
              className={`w-full p-3 pr-10  rounded-lg outline-none form-style focus:ring-2 focus:ring-blue-400 transition ${errors.ConfirmPass && "border-red-500"}`}
              placeholder="Confirm your password"
              onChange={(e)=>setConfirmPass(e.target.value)}
  
            />
            <button
              type="button"
              className="absolute right-3 top-12 transform -translate-y-1/2 text-2xl "
              tabIndex={-1}
              onClick={() => setShowConfirm(s => !s)}
            >
              {showConfirm ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}
            </button>
            {errors.ConfirmPass && (
              <span className="text-red-600 text-sm">{errors.ConfirmPass.message}</span>
            )}
          </div>
        </div>
  
        {/* Submit button */}
            <button
        type="submit"
        className={`w-full ${Loading ? 'bg-gray-200 text-gray-500' : 'bg-yellow-200 Org_Btns hover:bg-yellow-100 text-white'} font-semibold py-3 Button rounded-lg mt-4 text-lg transition duration-200 shadow flex justify-center items-center`}
        disabled={Loading || names === "taken" || emails === "taken" || numbers === "taken"}
      >
        {Loading ? (
          <>
            <Loader />
            <span className="ml-2">Processing...</span>
          </>
        ) : (
          'Submit'
        )}
      </button>
      </form>
    )
  }
export default Org