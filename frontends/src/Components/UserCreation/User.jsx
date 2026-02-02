import React, { useEffect, useState } from 'react';
import CountryCodee from '../../data/CountryCode.json';
import { useForm } from 'react-hook-form';
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';
import Loader from '../extra/Loading';
import { FindUserName, NumberFinder, findemail,sendOtp } from '../../Services/operations/Auth';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Join from './Join'
const User = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mail, setMail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [names, setNames] = useState(""); // "" | "available" | "taken"
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [samePass, setSamePass] = useState(false);
  const [email, setEmail] = useState(''); // Lowercase for consistency
  const [emails, setEmails] = useState(''); // "" | "available" | "taken"
  const [phoneNumber, setPhoneNumber] = useState(''); // Renamed to avoid conflict
  const [numbers, setNumbers] = useState(''); // "" | "available" | "taken"
  const [Loading,setloading] = useState(false)
  const [otp,setOTP] = useState('')
  const [Data,setData] = useState(null)
 
// console.log(otp/)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();

  const password = watch('Password');
  const confirmPass = watch('ConfirmPass');

  // Watch for password match - FIXED
  useEffect(() => {
    setSamePass(confirmPass === password && password > 0); // Fixed: Check length
  }, [password, confirmPass]);

  // Username availability check - FIXED dependencies
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

  // Email availability check - FIXED
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

  // Number availability check - FIXED
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
  }, [phoneNumber, dispatch]); // Added dispatch

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

  const onSubmit = async (data) => {
  // console.log(data)

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
      password: data.Password,
      confirmPassword: data.ConfirmPass,
      countrycode: data.CountryCode,
      phoneNumber: data.Number,
       usertype:"Viewer"
    };
      // console.log("Full data object:", finalData); 
       setData(finalData)
       setMail(data.Email)
         const otp = await sendOTP(data.Email); // Get OTP directly
      if (!otp) return; // Stop if OTP send fails

       setShowOtp(true)
       navigate("/OTP",{
        state: {
            otp,   
            mail: data.Email,
            data: finalData,
  },
})
setShowOtp(false)
      }catch(error){
        console.error("User creation error:", error);
      setErrorMessage(error.message || "An error occurred during signup.");
      }
  };
  
  if(Loading){
    return (
      <div className='w-full h-full  flex flex-col'>
        <div className='flex-1 flex justify-center items-center '>
          <Loader data="text-4xl border relative left-10  top-10"/>
        </div>
      </div>
    )
  }

  // Helper functions for asterisk colors
  const nameAsteriskColor = names === "available" ? "text-caribgreen-500" : "text-red-500";
  const emailAsteriskColor = emails === "available" ? "text-caribgreen-500" : "text-red-500";
  const numberAsteriskColor = numbers === "available" ? "text-caribgreen-500" : "text-red-500";
  
  // { otp && <Otp mail={mail} Style={``}  data={Data} OTP={otp} />} 
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-max rounded-2xl shadow-lg space-y-8 bg-richblack-800"
    >
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}

      {/* Username Feedback */}
      {names && (
        <span className={`flex font-semibold ${names === "available" ? "text-caribgreen-500" : "text-red-500"}`}>
          This username is {names}.
        </span>
      )}

      {/* Name Row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-2 font-semibold" htmlFor="First">
            First Name <span className={nameAsteriskColor}>*</span>
            {errors.First && <span className="text-red-600 text-sm"> {errors.First.message}</span>}
          </label>
          <input
            type="text"
            {...register("First", { required: "Required" })}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 form-style transition ${errors.First ? "border-red-500" : ""}`}
            placeholder="Enter First Name"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-semibold" htmlFor="Last">
            Last Name <span className={nameAsteriskColor}>*</span>
            {errors.Last && <span className="text-red-600 text-sm"> {errors.Last.message}</span>}
          </label>
          <input
            type="text"
            {...register("Last", { required: "Required" })}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full p-3 rounded-lg outline-none focus:ring-2 form-style focus:ring-blue-400 transition ${errors.Last ? "border-red-500" : ""}`}
            placeholder="Enter Last Name"
          />
        </div>
      </div>

      {/* Email */}
      <div className='EmailSign'>
        <label className="flex gap-3 mb-2 font-semibold" htmlFor="Email">
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
          className={`w-full p-3 rounded-lg form-style outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.Email ? "border-red-500" : ""}`}
          placeholder="Enter Your Email Address"
        />
      </div>

      {/* Phone */}
      <div className="flex gap-4 Country">

        <div className="w-32">
          <label className="block mb-2 font-semibold" htmlFor="CountryCode">
            Country Code <span className="text-caribgreen-500">*</span>
          </label>
          <select
            {...register("CountryCode", { required: "Country code is required" })}
            className={`p-3 w-full bg-richblack-600 h-11 form-style rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.CountryCode ? "border-red-500" : ""}`}
            defaultValue=""
          >
            <option value="" disabled>Select Your Country Code</option>
            {CountryCodee.map((data, i) => (
              <option key={i} value={data.code}>
                {data.code} - {data.country}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="flex gap-3 mb-2 font-semibold" htmlFor="Number">
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
              pattern: { value: /^\d{10}$/, message: "Number must be exactly 10 digits" },
            })}
            onChange={(e) =>setPhoneNumber(e.target.value)}
            className={`w-full p-3 rounded-lg outline-none form-style focus:ring-2 focus:ring-blue-400 transition ${errors.Number ? "border-red-500" : ""}`}
            placeholder="Enter Your 10-digit Mobile Number"
          />
        </div>
      </div>

      {/* Passwords */}
      <div className="flex gap-4 Password">
        <div className="flex-1 relative">
          <label className="block mb-2 font-semibold" htmlFor="Password">
            Password <span className={`${samePass ? "text-caribgreen-500" : "text-red-500"}`}>*</span>
            {errors.Password && <span className="text-red-600 text-sm"> {errors.Password.message}</span>}
          </label>
          <input
            type={showPass ? "text" : "password"}
            {...register("Password", {
              required: "Required",
              minLength: { value: 1, message: "Password must be at least 1 character" },
              maxLength: { value: 10, message: "Password must be at most 10 characters" },
            })}
            className={`w-full p-3 pr-10 rounded-lg outline-none form-style focus:ring-2 focus:ring-blue-400 transition ${errors.Password ? "border-red-500" : ""}`}
            placeholder="Enter Your Password"
          />
          <button
            type="button"
            className="absolute right-3 top-12 transform -translate-y-1/2 text-2xl"
            onClick={() => setShowPass((s) => !s)}
          >
            {showPass ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}
          </button>
        </div>
        <div className="flex-1 relative">
          <label className="block mb-2 font-semibold" htmlFor="ConfirmPass">
            Confirm Password <span className={`${samePass ? "text-caribgreen-500" : "text-red-500"}`}>*</span>
            {errors.ConfirmPass && <span className="text-red-600 text-sm"> {errors.ConfirmPass.message}</span>}
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            {...register("ConfirmPass", {
              required: "Required",
              minLength: { value: 1, message: "Confirm password must be at least 1 character" },
              maxLength: { value: 10, message: "Confirm password must be at most 10 characters" },
              validate: (val) => val === password || "Passwords do not match",
            })}
            className={`w-full p-3 pr-10 rounded-lg outline-none form-style focus:ring-2 focus:ring-blue-400 transition ${errors.ConfirmPass ? "border-red-500" : ""}`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute right-3 top-12 transform -translate-y-1/2 text-2xl"
            onClick={() => setShowConfirm((s) => !s)}
          >
            {showConfirm ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}
          </button>
        </div>
      </div>

      {/* Submit Button - FIXED validation */}
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
  );
};

export default User;
