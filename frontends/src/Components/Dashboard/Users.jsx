import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Loader from '../extra/Loading'
import toast from 'react-hot-toast'
import {
  GetAllVerifiedUsers,
  GetAllUnverifiedUsers,
  GetAllVerifiedOrganizers,
  GetAllUnverifiedOrganizers,
  GetAllVerifiedTheatres,
  GetAllUnverifiedTheatres,
} from '../../Services/operations/Admin'

const TABS = [
  { key: 'users', label: 'Users' },
  { key: 'organizers', label: 'Organizers' },
  { key: 'theatres', label: 'Theatres' },
]

const Users = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [activeTab, setActiveTab] = useState('users')
  const [filter, setFilter] = useState('all') // all | verified | unverified
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [users, setUsers] = useState([])
  const [organizers, setOrganizers] = useState([])
  const [theatres, setTheatres] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 2

  useEffect(() => {
    if (!token) return
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [vUsers, uUsers, vOrgs, uOrgs, vTheatres, uTheatres] = await Promise.all([
          dispatch(GetAllVerifiedUsers(token, navigate)),
          dispatch(GetAllUnverifiedUsers(token, navigate)),
          dispatch(GetAllVerifiedOrganizers(token, navigate)),
          dispatch(GetAllUnverifiedOrganizers(token, navigate)),
          dispatch(GetAllVerifiedTheatres(token, navigate)),
          dispatch(GetAllUnverifiedTheatres(token, navigate)),
        ])

        const markVerified = (arr, v) => (arr || []).map((u) => ({ ...u, _verified: v }))

        const allUsers = [
          ...markVerified(vUsers?.data, true),
          ...markVerified(uUsers?.data, true).filter(
            (u) => !vUsers?.data?.some((v) => v._id === u._id)
          ),
        ]
        // deduplicate: unverified endpoint returns all, verified returns only verified
        const uUserIds = new Set((vUsers?.data || []).map((u) => u._id))
        const mergedUsers = [
          ...markVerified(vUsers?.data, true),
          ...(uUsers?.data || []).filter((u) => !uUserIds.has(u._id)).map((u) => ({ ...u, _verified: false })),
        ]

        const vOrgIds = new Set((vOrgs?.data || []).map((u) => u._id))
        const mergedOrgs = [
          ...markVerified(vOrgs?.data, true),
          ...(uOrgs?.data || []).filter((u) => !vOrgIds.has(u._id)).map((u) => ({ ...u, _verified: false })),
        ]

        const vTheatreIds = new Set((vTheatres?.data || []).map((u) => u._id))
        const mergedTheatres = [
          ...markVerified(vTheatres?.data, true),
          ...(uTheatres?.data || []).filter((u) => !vTheatreIds.has(u._id)).map((u) => ({ ...u, _verified: false })),
        ]

        setUsers(mergedUsers)
        setOrganizers(mergedOrgs)
        setTheatres(mergedTheatres)
      } catch (error) {
        console.error(error)
        toast.error('Error fetching data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [token])

  const getActiveData = () => {
    if (activeTab === 'users') return users
    if (activeTab === 'organizers') return organizers
    return theatres
  }

  const filtered = getActiveData().filter((u) => {
    const matchSearch =
      !search ||
      u.userName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'verified' && u.verified) ||
      (filter === 'unverified' && !u.verified)
    return matchSearch && matchFilter
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getLastLogin = (lastlogin) => {
    if (!lastlogin || lastlogin.length === 0) return 'Never'
    return lastlogin[lastlogin.length - 1]
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, filter, search])

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  const stats = {
    total: getActiveData().length,
    verified: getActiveData().filter((u) => u.verified).length,
    unverified: getActiveData().filter((u) => !u.verified).length,
  }

  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">All Users Overview</h1>
        <p className="text-gray-400 mt-1 text-sm">
          View all users, organizers, and theatres with their verification status and last login
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white'
                : 'bg-[#1a1a2e] border border-gray-700 text-gray-400 hover:border-purple-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-green-500/20">
          <p className="text-green-400 text-xs uppercase tracking-wide">Verified</p>
          <p className="text-2xl font-bold mt-1 text-green-400">{stats.verified}</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-red-500/20">
          <p className="text-red-400 text-xs uppercase tracking-wide">Unverified</p>
          <p className="text-2xl font-bold mt-1 text-red-400">{stats.unverified}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-400 text-left">
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Verified</th>
                <th className="p-4 font-medium">Created At</th>
                <th className="p-4 font-medium">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-10">
                    No {activeTab} found.
                  </td>
                </tr>
              ) : (
                paginated.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700/30 hover:bg-white/5 transition"
                  >
                    <td className="p-4 text-gray-500">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-4">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.userName}
                          className="w-9 h-9 rounded-full object-cover border border-gray-600"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                          {user.userName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{user.userName}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4 text-gray-400">
                      {user.countrycode} {user.number}
                    </td>
                    <td className="p-4">
                      {user.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          <FaCheckCircle className="text-[10px]" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          <FaTimesCircle className="text-[10px]" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{user.createdAt || 'N/A'}</td>
                    <td className="p-4 text-gray-400 text-xs">{getLastLogin(user.lastlogin)}</td>
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
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-[#1a1a2e] border border-gray-700 rounded-lg text-sm disabled:opacity-50 hover:border-purple-500 transition"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page
              if (totalPages <= 5) {
                page = i + 1
              } else if (currentPage <= 3) {
                page = i + 1
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i
              } else {
                page = currentPage - 2 + i
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                    currentPage === page
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-[#1a1a2e] border-gray-700 hover:border-purple-500'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-[#1a1a2e] border border-gray-700 rounded-lg text-sm disabled:opacity-50 hover:border-purple-500 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
