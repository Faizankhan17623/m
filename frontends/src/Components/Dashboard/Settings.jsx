import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../extra/Loading";
import { IoIosArrowBack } from "react-icons/io";
import Profesion from "../../data/Professsion.json";
import CountryCodee from "../../data/CountryCode.json";
import { MdDelete } from "react-icons/md";
import { Changeimage } from "../../Services/operations/User";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LiaEyeSolid,LiaEyeSlashSolid  } from "react-icons/lia";
  
const Settings = () => {
  const { image, token } = useSelector((state) => state.auth);
  const { cooldownDate } = useSelector((state) => state.profile);
  
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword")

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(handler);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await dispatch(Changeimage(token, selectedFile,navigate));
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const isCooldownActive =
    cooldownDate && new Date(cooldownDate) > new Date();
  const timeLeft = isCooldownActive
    ? Math.ceil((new Date(cooldownDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // send to backend
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-[1000px] bg-richblack-900 flex flex-col items-center gap-5 px-4 py-6 overflow-x-hidden overflow-y-auto"
    >
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <button className="text-richblack-300 flex items-center gap-2">
          <IoIosArrowBack />
          <span className="text-richblack-400">Back</span>
        </button>
        <h1 className="text-white font-bold text-2xl">Edit Profile</h1>
      </div>

      {isCooldownActive && (
        <p style={{ color: "red" }}>
          You can change your image again in {timeLeft} day(s).
        </p>
      )}

      {/* Profile picture */}
      <div className="w-full max-w-3xl bg-richblack-800 rounded-xl shadow flex items-center gap-6">
        <img
          src={
            selectedFile
              ? URL.createObjectURL(selectedFile)
              : image || "/default-profile.png"
          }
          alt="profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-yellow-300"
        />
        <div className="flex flex-col gap-3">
          <p className="text-white text-lg text-red-400">Change Profile Picture</p>
          <div className="flex gap-3">
            {selectedFile ? (
              <button
                type="button"
                className="bg-yellow-300 text-black rounded BUttons px-4 py-2"
                onClick={handleUpload}
                disabled={isCooldownActive}
              >
                Upload
              </button>
            ) : (
              <label className="bg-yellow-300 text-black rounded px-4 py-2 cursor-pointer BUttons">
                Select
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={isCooldownActive}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setSelectedFile(file);
                  }}
                />
              </label>
            )}
            <button
              type="button"
              className={`bg-richblack-700 text-white BUttons rounded px-4 py-2 ${
                !selectedFile && "cursor-not-allowed"
              }`}
              onClick={() => setSelectedFile(null)}
              disabled={isCooldownActive}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-full max-w-3xl bg-richblack-800 rounded-xl shadow flex flex-col gap-6 p-6">
        <h2 className="text-white font-semibold text-lg text-yellow-200 Pa">Profile Information</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-richblack-100 mb-1">Display Name *</label>
            <input
              {...register("displayName", { required: "Display Name is required" })}
              className="form-style w-full"
              placeholder="Enter your name"
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-richblack-100 mb-1">Profession *</label>
            <select
              {...register("profession", { required: "Profession is required" })}
              className="form-style w-full bg-richblack-700"
            >
              <option value="">Select your profession</option>
              {Profesion.professions.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
            {errors.profession && (
              <p className="text-red-500 text-xs mt-1">{errors.profession.message}</p>
            )}
          </div>
        </div>

        {/* dob + gender */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-richblack-100 mb-1">Date of Birth *</label>
            <input
              type="date"
              {...register("dob", { required: "Date of Birth is required" })}
              className="form-style w-full"
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>
            )}
          </div>
          <div>
            <label className="block text-richblack-100 mb-1">Gender *</label>
            <div className="flex gap-5 mt-2">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={g}
                    {...register("gender", { required: "Gender is required" })}
                    className="accent-yellow-400"
                  />
                  <span className="text-richblack-200">{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* phone + about */}
          <div className="w-full PI">
            <label className="block text-richblack-100 mb-1">Mobile Number *</label>
            <div className="flex justify-around items-center gap-5">
              <select
                {...register("countryCode", { required: "Code is required" })}
                className="form-style w-[200px] rounded-r-none bg-richblack-700"
                defaultValue=""
              >
                <option value="" disabled>Select Country</option>
                {CountryCodee.map((c, i) => (
                  <option key={i} value={c.code}>{c.country}-{c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                maxLength={10}
                {...register("mobileNumber", { required: "Number is required" })}
                className="form-style flex-1 rounded-l-none [550px]"
                placeholder="Enter number"
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>
            )}
          </div>
          {/* <div>
            <label className="block text-richblack-100 mb-1">About *</label>
            <input
              {...register("about", {
                required: "About is required",
                minLength: { value: 10, message: "About must be at least 10 characters" }
              })}
              className="form-style w-full"
              placeholder="Enter bio"
            />
            {errors.about && (
              <p className="text-red-500 text-xs mt-1">{errors.about.message}</p>
            )}
          </div> */}
      </div>

      {/* Password section */}
      <div className="w-full max-w-3xl bg-richblack-800 rounded-xl shadow p-6">
        <h2 className="text-white font-semibold text-lg mb-6 text-yellow-200 Pa">Password</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-richblack-100 mb-1">Current Password</label>
            <input
              type="password"
              {...register("currentPassword", {
                required: "New password is required",
                 minLength: { value: 6, message: "Password must be at least 6 character" },
                maxLength: { value: 10, message: "Password must be at most 10 characters" },
              })}
              className="form-style w-full"
            />
              {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-richblack-100 mb-1">New Password *</label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 character" },
                maxLength: { value: 10, message: "Password must be at most 10 characters" },
              })}
              className="form-style w-full"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>
        </div>

     
      </div>

      {/* Delete account */}
      <div className="w-full max-w-3xl bg-[#522a35] rounded-xl shadow flex gap-4 p-6">
        <div className="rounded-full p-3 text-white text-xl flex justify-center items-center">
          <MdDelete className="text-4xl" />
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-2">Delete Account</h3>
          <p className="text-richblack-200 mb-1">
            Would you like to delete your account?
          </p>
          <p className="text-richblack-200 mb-3">
            This account contains paid courses. Deleting your account will remove all
            associated content.
          </p>
          <Link to="/" className="text-pink-300 underline">
            I want to delete my account.
          </Link>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-3xl flex justify-end gap-4 pt-4 pb-8">
        <button type="button" className="bg-richblack-700 text-white BUttons rounded px-4 py-2">
          Cancel
        </button>
        <button
          type="submit"
          className="bg-yellow-400 text-black rounded px-4 py-2 BUttons"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Settings;
