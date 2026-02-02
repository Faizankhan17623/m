import React, { useEffect, useState, useRef } from 'react'
import Loader from '../extra/Loading'
import { FaCheckCircle, FaTimesCircle, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa'
import {GetAllOrgDetails,VerifyOrgs,deleteorgs,deleteAllOrgs} from '../../Services/operations/Admin'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import {GetAllUserDetails} from '../../Services/operations/User'
import { useSearchParams } from 'react-router-dom'
import Logout from '../extra/Logout';


const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
  Approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
  locked: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

const UserManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {token} = useSelector((state)=>state.auth)  
  
  const [loading, setloading] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceTimer = useRef(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrg, setSelectedOrg] = useState([])
  const [roleDetail, setRoleDetail] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [showDetail, setShowDetail] = useState(false)
  const [orgdata,setOrgdata] = useState([])
  const [fullData, setFullData] = useState(null)
  const [reject,setReject] = useState("")
  const [rejectOrg, setRejectOrg] = useState(null)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectDate, setRejectDate] = useState("")
  const [rejectTime, setRejectTime] = useState("")
  const [showImagePreview, setShowImagePreview] = useState(false)
 const [searchParams, setSearchParams] = useSearchParams();
 const [accept,setAccept] = useState()
 const [confirmationModal, setConfirmationModal] = useState(null);
 
 const [currentPage, setCurrentPage] = useState(1)
 const itemsPerPage = 2

//  console.log(rejectDate)
//  console.log(rejectTime)

//  orgdata

 const tomorrow = new Date()
 tomorrow.setDate(tomorrow.getDate() + 1)
 const Min_Date = tomorrow.toISOString().split('T')[0]
 const maxDay = new Date()
 maxDay.setDate(maxDay.getDate() + 31)
 const Max_Date = maxDay.toISOString().split('T')[0]

 const ORgId = searchParams.get("id")

  useEffect(()=>{
    const ApiCall = async()=>{
        if (!token) return;
      setloading(true)
      try{
        const response = await dispatch(GetAllOrgDetails(token,navigate))
        if (response?.success) {
          setOrgdata(response.data.organizersData)
          setFullData(response.data)
        }
      }catch(error){
        console.log(error)
        console.log(error.message)
        toast.error("There is an error while Fetching all the Orgainzer details")
      }finally{
        setloading(false)
      }
    }
    if(token)ApiCall()
  },[token,navigate,dispatch])


  const AcceptOrg = async (id)=>{
     if (!token) return;
      setloading(true)
    try{
      // This onw will work wehen the use is accepted 
      const response = await dispatch(VerifyOrgs(token,id,true,null,null,"approved",navigate))
       if (response?.success) {
         console.log(response)
         toast.success("Organizer approved successfully")
         setOrgdata(prev => prev.map(o => o.id === id ? {...o, status: 'approved'} : o))
         setShowDetail(false)
       }
    }catch(error){
      console.log(error)
      console.log(error.message)
      toast.error("There is an error in the Verifying the organizers")
    }finally{
      setloading(false)
    }
  }

  const RejectOrg = async (id,editdate,edittime)=>{
    if (!token) return;
      setloading(true)
    try{
// console.log("This is the id fro mthe reject",id

      const EditDate = (date)=>{
        const [year,month,day] = date.split("-")
        return `${day}/${month}/${year}`
      }

      const dates = EditDate(editdate)
      const editTime = edittime

      const response = await dispatch(VerifyOrgs(token, id, false, dates, editTime, "rejected", navigate))
       if (response?.success) {
         toast.success("Organizer rejected successfully")
         setOrgdata(prev => prev.map(o => o.id === id ? {...o, status: 'rejected'} : o))
         setReject("")
         setRejectOrg(null)
       }
       
    }catch(error){
      console.log(error)
      toast.error("There is an error in rejecting the organizer")
    }finally{
      setloading(false)
    }
  }



  const filteredData = orgdata.filter((o) => {
    if (debouncedSearch) {
      return o.username?.toLowerCase().includes(debouncedSearch.toLowerCase()) || o.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    }
    if (filterStatus === 'all') {
      return o.status?.toLowerCase() !== 'locked'
    }
    return o.status?.toLowerCase() === filterStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

   const handleDelete = async (id) => {
         if (!token) return;
         setloading(true)
         try {
           const response = await dispatch(deleteorgs(token, id, navigate))
           if (response?.success) {
             setOrgdata(prev => prev.filter(o => o.id !== id))
             setShowDetail(false)
             setConfirmationModal(null)
           }
         } catch (error) {
           console.log(error)
           toast.error("Error deleting organizer")
         } finally {
           setloading(false)
         }
       }

       const openDeleteModal = (id) => {
  setConfirmationModal({
    text1: 'Are you sure?',
    text2: 'Do you want to delete this account?',
    btn1Text: 'Delete',
    btn2Text: 'Cancel',
    btn1Handler: () => handleDelete(id),
    btn2Handler: () => setConfirmationModal(null),
  })
}

  const handleDeleteAll = async () => {
    if (!token || selectedIds.length === 0) return
    setloading(true)
    try {
      const response = await dispatch(deleteAllOrgs(token, selectedIds, navigate))
      if (response?.success) {
        setOrgdata(prev => prev.filter(o => !selectedIds.includes(o.id)))
        setSelectedIds([])
        setConfirmationModal(null)
      }
    } catch (error) {
      console.log(error)
      toast.error("Error deleting organizers")
    } finally {
      setloading(false)
    }
  }

  const openDeleteAllModal = () => {
    setConfirmationModal({
      text1: 'Are you sure?',
      text2: `Do you want to delete ${selectedIds.length} organizer(s)?`,
      btn1Text: 'Delete All',
      btn2Text: 'Cancel',
      btn1Handler: () => handleDeleteAll(),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const toggleSelectId = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const allIds = paginatedData.map(o => o.id)
    const allSelected = allIds.every(id => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allIds.includes(id)))
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...allIds])])
    }
  }
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Organizer Management</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Verify, view, and manage organizer submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold mt-1">{orgdata.length}</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-yellow-500/20">
          <p className="text-yellow-400 text-xs uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold mt-1 text-yellow-400">
            {orgdata.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-green-500/20">
          <p className="text-green-400 text-xs uppercase tracking-wide">Approved</p>
          <p className="text-2xl font-bold mt-1 text-green-400">
            {orgdata.filter((o) => o.status === 'approved').length}
          </p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-red-500/20">
          <p className="text-red-400 text-xs uppercase tracking-wide">Rejected</p>
          <p className="text-2xl font-bold mt-1 text-red-400">
            {orgdata.filter((o) => o.status === 'rejected' || o.status === 'locked').length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
              if (debounceTimer.current) clearTimeout(debounceTimer.current)
              debounceTimer.current = setTimeout(() => {
                setDebouncedSearch(e.target.value)
              }, 5000)
            }}
            className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
            className="bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="locked">Locked</option>
          </select>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={openDeleteAllModal}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            <FaTrash />
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-400 text-left">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every(o => selectedIds.includes(o.id))}
                    onChange={toggleSelectAll}
                    className="accent-purple-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Experience</th>
                <th className="p-4 font-medium">Created At</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-10">
                    No organizers found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((org) => (
                  <tr
                    key={org._id}
                    className="border-b border-gray-700/30 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(org.id)}
                        onChange={() => toggleSelectId(org.id)}
                        className="accent-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4 font-medium">{org.username}</td>
                    <td className="p-4 text-gray-400">{org.email}</td>
                    <td className="p-4">{org.Role}</td>
                    <td className="p-4">{org.ExperienceLevel}</td>
                    <td className="p-4 text-gray-400">{org.createdAt}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[org.status]}`}
                      >
                        {org.status}
                      </span>
                    </td>
                     <td className="p-4"> 
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                          setShowDetail(true)
                          setSelectedOrg(org)
                          setSearchParams({ id: org.id});
                          // Find role-specific detail based on Role + ExperienceLevel
                          if (fullData) {
                            let detail = null;
                            if (org.Role === 'Director' && org.ExperienceLevel === 'Fresher') {
                              detail = fullData.directorFresh?.find(d => d._id === org.DirectFresh);
                            } else if (org.Role === 'Director' && org.ExperienceLevel !== 'Fresher') {
                              detail = fullData.directorExperience?.find(d => d._id === org.DirectFresh);
                            } else if (org.Role === 'Producer' && org.ExperienceLevel === 'Fresher') {
                              detail = fullData.producerFresh?.find(d => d._id === org.DirectFresh);
                            } else if (org.Role === 'Producer' && org.ExperienceLevel !== 'Fresher') {
                              detail = fullData.producerExperience?.find(d => d._id === org.DirectFresh);
                            }
                            setRoleDetail(detail);
                          }
                            }}
                          title="View Details"
                          className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <FaEye />
                        </button>
                        {(org.status === 'pending' || org.status === 'rejected') && (
                          <>
                            <button
                              onClick={() => AcceptOrg(org.id)}
                              title="Approve"
                              className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition"
                            >
                              <FaCheckCircle />
                            </button>
                            
                            <button
                              title="Reject"
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                               onClick={()=>{setReject(org._id); setRejectOrg(org); ; setRejectDate(""); setRejectTime("")}}
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openDeleteModal(org.id)}
                          title="Delete"
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td> 
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-[#1a1a2e] border border-gray-700 rounded-lg text-sm disabled:opacity-50 hover:border-purple-500 transition"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  currentPage === i + 1
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-[#1a1a2e] border-gray-700 hover:border-purple-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-[#1a1a2e] border border-gray-700 rounded-lg text-sm disabled:opacity-50 hover:border-purple-500 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedOrg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#7c3aed #1a1a2e',
            }}>
            {/* Header with close */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#12122a] z-10 pb-4 border-b border-gray-700/50">
              <h2 className="text-xl font-bold">Organizer Details</h2>
              <button
                onClick={() => {
                  setShowDetail(false)
                  setSearchParams({})
                }}
                className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-lg transition"
              >
                &times;
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#1a1a2e] rounded-xl border border-gray-700/50">
              {selectedOrg.image && (
                <img
                  src={selectedOrg.image}
                  alt={selectedOrg.username}
                  onClick={() => setShowImagePreview(true)}
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/50 cursor-pointer hover:opacity-80 transition"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold">{selectedOrg.username}</h3>
                <p className="text-gray-400 text-sm">{selectedOrg.email}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[selectedOrg.status]}`}>
                    {selectedOrg.status}
                  </span>
                  <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {selectedOrg.Role} - {selectedOrg.ExperienceLevel}
                  </span>
                  <span className="text-xs text-gray-500">
                    Attempts: {selectedOrg.attempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">Personal Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Gender</p>
                  <p className="mt-1 text-sm">{selectedOrg.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Phone</p>
                  <p className="mt-1 text-sm">{selectedOrg.CountryCode} {selectedOrg.number}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Website</p>
                  {selectedOrg.website ? (
                    <a href={selectedOrg.website} target="_blank" rel="noreferrer" className="mt-1 text-sm text-blue-400 hover:underline block truncate">{selectedOrg.website}</a>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">N/A</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">Address</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Country</p>
                  <p className="mt-1 text-sm">{selectedOrg.Country}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">State</p>
                  <p className="mt-1 text-sm">{selectedOrg.state}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">City</p>
                  <p className="mt-1 text-sm">{selectedOrg.City}</p>
                </div>
                <div className="col-span-2 md:col-span-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Local Address</p>
                  <p className="mt-1 text-sm">{selectedOrg.localaddress}</p>
                </div>
                {!selectedOrg.sameforlocalandpermanent && (
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Permanent Address</p>
                    <p className="mt-1 text-sm">{selectedOrg.permanentaddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">Professional Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Role</p>
                  <p className="mt-1 text-sm">{selectedOrg.Role}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Experience Level</p>
                  <p className="mt-1 text-sm">{selectedOrg.ExperienceLevel}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Years of Experience</p>
                  <p className="mt-1 text-sm">{selectedOrg.yearsexperience}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Total Projects</p>
                  <p className="mt-1 text-sm">{selectedOrg.totalprojects}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Collaboration</p>
                  <p className="mt-1 text-sm">{selectedOrg.Collaboration}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Comfortable</p>
                  <p className="mt-1 text-sm">{selectedOrg.Comfortable}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Promotions</p>
                  <p className="mt-1 text-sm">{selectedOrg.Promotions}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Support Needed</p>
                  <p className="mt-1 text-sm">{selectedOrg.Support?.needed === 'Yes' ? selectedOrg.Support.type : 'No'}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-xs uppercase tracking-wide">Main Reason</p>
                <p className="mt-1 text-sm bg-[#1a1a2e] p-3 rounded-lg border border-gray-700/30">{selectedOrg.MainReason}</p>
              </div>
              <div className="mt-3">
                <p className="text-gray-500 text-xs uppercase tracking-wide">Short Bio</p>
                <p className="mt-1 text-sm text-gray-300 bg-[#1a1a2e] p-3 rounded-lg border border-gray-700/30">{selectedOrg.Shortbio}</p>
              </div>
            </div>

            {/* Genre & Audience */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">Genre & Audience</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.Genre?.map((g, i) => (
                      <span key={i} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-lg text-xs">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Sub Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.SubGenre?.map((g, i) => (
                      <span key={i} className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-lg text-xs">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Target Audience</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.Audience?.map((a, i) => (
                      <span key={i} className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded-lg text-xs">{a}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Screening</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.Screening?.map((s, i) => (
                      <span key={i} className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-1 rounded-lg text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            {selectedOrg.SocialMedia?.active === 'Yes' && selectedOrg.SocialMedia?.profiles?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">Social Media</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedOrg.SocialMedia.profiles.map((p, i) => (
                    <a key={i} href={p.link} target="_blank" rel="noreferrer"
                      className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3 hover:border-blue-500/50 transition block">
                      <p className="text-sm font-medium text-blue-400">{p.Platform}</p>
                      <p className="text-xs text-gray-400 mt-1">{p.followers} followers</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {selectedOrg.Certifications?.active === 'Yes' && selectedOrg.Certifications?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">Certifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedOrg.Certifications.items.map((c, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{c.Name}</p>
                        <p className="text-xs text-gray-400 mt-1">{c.Date}</p>
                      </div>
                      {c.Certificate && (
                        <a href={c.Certificate} target="_blank" rel="noreferrer"
                          className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/30 transition">
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notable Projects */}
            {selectedOrg.NotableProjects?.needed === 'Yes' && selectedOrg.NotableProjects?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">
                  Notable Projects ({selectedOrg.NotableProjects.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.NotableProjects.items.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.Name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">Budget: {p.Budget}</span>
                          <span className="text-xs text-gray-400">Role: {p.Role}</span>
                        </div>
                      </div>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noreferrer"
                          className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition">
                          Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ongoing Projects */}
            {selectedOrg.ongoing?.active === 'Yes' && selectedOrg.ongoing?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">
                  Ongoing Projects ({selectedOrg.ongoing.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.ongoing.items.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.ProjectName}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-gray-400">Start: {p.StartDate}</span>
                          <span className="text-xs text-gray-400">End: {p.EndDate}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${p.Released === 'Yes' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                            {p.Released === 'Yes' ? 'Released' : 'Not Released'}
                          </span>
                        </div>
                      </div>
                      {p.Script && (
                        <a href={p.Script} target="_blank" rel="noreferrer"
                          className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/30 transition">
                          Script
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planned Projects */}
            {selectedOrg.planned?.active === 'Yes' && selectedOrg.planned?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">
                  Planned Projects ({selectedOrg.planned.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.planned.items.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
                      <p className="text-sm font-medium">{p.ProjectName}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400">Start: {p.StartDate}</span>
                        <span className="text-xs text-gray-400">End: {p.EndDate}</span>
                        {p.ProjectStatus && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                            {p.ProjectStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distribution */}
            {selectedOrg.Distribution?.needed === 'Yes' && selectedOrg.Distribution?.projects?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">
                  Distribution ({selectedOrg.Distribution.projects.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.Distribution.projects.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
                      <p className="text-sm font-medium">{p.ProjectName}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400">Budget: {p.Budget}</span>
                        <span className="text-xs text-gray-400">Role: {p.Role}</span>
                        <span className="text-xs text-gray-400">Release: {p.ReleaseDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role-Specific Details */}
            {roleDetail && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">
                  {selectedOrg.Role} - {selectedOrg.ExperienceLevel} Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roleDetail.DirectorInspiration && (
                    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Director Inspiration</p>
                      <p className="mt-1 text-sm">{roleDetail.DirectorInspiration}</p>
                    </div>
                  )}
                  {roleDetail.EarlyChalenges && (
                    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Early Challenges</p>
                      <p className="mt-1 text-sm">{roleDetail.EarlyChalenges}</p>
                    </div>
                  )}
                  {roleDetail.ProjectPlanning && (
                    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Project Planning</p>
                      <p className="mt-1 text-sm">{roleDetail.ProjectPlanning}</p>
                    </div>
                  )}
                  {roleDetail.ProjectsDone && (
                    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Projects Done</p>
                      <p className="mt-1 text-sm">{roleDetail.ProjectsDone}</p>
                    </div>
                  )}
                  {roleDetail.PromotionMarketing && (
                    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Promotion & Marketing</p>
                      <p className="mt-1 text-sm">{roleDetail.PromotionMarketing}</p>
                    </div>
                  )}
                  {roleDetail.SceneVisualization && (
                    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-3">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Scene Visualization</p>
                      <p className="mt-1 text-sm">{roleDetail.SceneVisualization}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 border-b border-gray-700/50 pb-2">Timestamps</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Created At</p>
                  <p className="mt-1 text-sm">{new Date(selectedOrg.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Updated At</p>
                  <p className="mt-1 text-sm">{new Date(selectedOrg.updatedAt).toLocaleString()}</p>
                </div>
                {selectedOrg.editUntil && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Edit Until</p>
                    <p className="mt-1 text-sm">{new Date(selectedOrg.editUntil).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons in modal */}
            <div className="flex gap-3 mt-8 sticky bottom-0 bg-[#12122a] pt-4 border-t border-gray-700/50">
              {(selectedOrg.status === 'pending' || selectedOrg.status === 'rejected') && (
                <>
                  <button
                    onClick={() => {
                      AcceptOrg(ORgId)
                      setSearchParams({ id: searchParams.get("id"), status : "Approved"});
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => {
                      setRejectOrg(selectedOrg)
                      setReject(selectedOrg._id)
                      setShowDetail(false)
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Overlay */}
      {showImagePreview && selectedOrg?.image && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition z-10"
            >
              &times;
            </button>
            <img
              src={selectedOrg.image}
              alt={selectedOrg.username}
              className="max-w-[80vw] max-h-[80vh] rounded-xl object-contain border-2 border-gray-600"
            />
          </div>
        </div>
      )}

      {reject && rejectOrg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-red-400">Reject Organizer</h2>
              <button
                onClick={() => { setReject(""); setRejectOrg(null) }}
                className="text-gray-400 hover:text-white text-xl transition"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Name</p>
                <p className="font-medium mt-1">{rejectOrg.username}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Email</p>
                <p className="text-gray-300 mt-1">{rejectOrg.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Role</p>
                <p className="mt-1">{rejectOrg.Role}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Experience</p>
                <p className="mt-1">{rejectOrg.ExperienceLevel}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Status</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[rejectOrg.status]}`}
                >
                  {rejectOrg.status}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Attempts</p>
                <p className="mt-1 text-sm">
                  {rejectOrg.attempts === 0 ? (
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-medium">First Timer</span>
                  ) : (
                    <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-medium">{rejectOrg.attempts} Attempt{rejectOrg.attempts > 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Edit Until (Date & Time)</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs mb-1 block">Date</label>
                    <input
                      type="date"
                      value={rejectDate}
                      onChange={(e) => setRejectDate(e.target.value)}
                      min={Min_Date}
                      max={Max_Date}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs mb-1 block">Time</label>
                    <input
                      type="time"
                      value={rejectTime}
                      onChange={(e) => setRejectTime(e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>


            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => { setReject(""); setRejectOrg(null) }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: call your reject API here with reject (org id) and rejectReason
                  setReject("")
                  setRejectOrg(null)
                  RejectOrg(rejectOrg.id,rejectDate,rejectTime)
                }}
                disabled={!rejectDate || !rejectTime}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <FaTimesCircle /> Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationModal && (
        <Logout modalData={confirmationModal} />
      )}
    </div>
  )
}

export default UserManagement
