import React, { useEffect, useState } from 'react'
import { VerifiedTheatres, AllotTickets } from '../../../Services/operations/orgainezer'
import { useDispatch, useSelector } from 'react-redux'
import { AllVerifiedData } from '../../../Services/operations/CreateShow'
import { useNavigate } from 'react-router-dom'
import {
  FaTicketAlt,
  FaArrowLeft,
  FaTheaterMasks,
  FaMapMarkerAlt,
  FaCheck,
  FaCalendarAlt,
  FaClock,
  FaFilm,
  FaTimes
} from 'react-icons/fa'
import { MdMovie, MdConfirmationNumber } from 'react-icons/md'

const TicketAllotment = () => {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Shows state
  const [shows, setShows] = useState([])
  const [showsLoading, setShowsLoading] = useState(false)
  const [showsError, setShowsError] = useState(null)
  const [selectedShow, setSelectedShow] = useState(null)

  // Theatres state
  const [theatres, setTheatres] = useState([])
  const [theatresLoading, setTheatresLoading] = useState(false)
  const [theatresError, setTheatresError] = useState(null)

  // Allotment form state
  const [selectedTheatre, setSelectedTheatre] = useState(null)
  const [totalToAllot, setTotalToAllot] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch shows
  const fetchShows = async () => {
    if (!token) {
      setShowsError("No token found. Please login again.")
      return
    }
    setShowsLoading(true)
    setShowsError(null)
    try {
      const response = await dispatch(AllVerifiedData(token, navigate))
      if (response?.success) {
        setShows(response.data || [])
      } else {
        setShowsError(response?.error || "Failed to fetch shows")
      }
    } catch (err) {
      console.error("Error fetching shows:", err)
      setShowsError(err?.message || "Error fetching shows")
    } finally {
      setShowsLoading(false)
    }
  }

  // Fetch theatres
  const fetchTheatres = async () => {
    setTheatresLoading(true)
    setTheatresError(null)
    try {
      const response = await dispatch(VerifiedTheatres(token, navigate))
      if (response) {
        setTheatres(Array.isArray(response) ? response : [])
      } else {
        setTheatresError("Failed to fetch theatres")
      }
    } catch (err) {
      console.error("Error fetching theatres:", err)
      setTheatresError(err?.message || "Error fetching theatres")
    } finally {
      setTheatresLoading(false)
    }
  }

  useEffect(() => {
    fetchShows()
  }, [token])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (duration) => {
    if (!duration) return 'N/A'
    const minutes = parseInt(duration)
    if (isNaN(minutes)) return duration
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
  }

  // When a show is selected, also fetch theatres
  const handleSelectShow = (show) => {
    setSelectedShow(show)
    setSelectedTheatre(null)
    setTotalToAllot('')
    fetchTheatres()
  }

  const handleCancel = () => {
    setSelectedShow(null)
    setSelectedTheatre(null)
    setTotalToAllot('')
  }

  // Handle allotment
  const handleAllot = async () => {
    if (!selectedShow?._id || !selectedTheatre?._id || !totalToAllot) return
    setSubmitting(true)
    try {
      await dispatch(AllotTickets(selectedShow._id, selectedTheatre._id, totalToAllot))
      setTotalToAllot('')
      setSelectedTheatre(null)
    } catch (err) {
      console.error('Error allotting tickets:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // ---- SHOW CARD (same style as CreateTicketes) ----
  const ShowCard = ({ show }) => (
    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-500/30 group">
      <div className="relative aspect-[2/3] overflow-hidden">
        {show.Posterurl ? (
          <img
            src={show.Posterurl}
            alt={show.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <MdMovie className="text-6xl text-gray-600" />
          </div>
        )}

        {show.genre?.genreName && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-500/90 text-black px-2 py-1 rounded text-xs font-semibold">
              {show.genre.genreName}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{show.title}</h3>

        {show.tagline && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{show.tagline}</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-yellow-500" />
            <span>{formatDate(show.releasedate)}</span>
          </div>
          {(show.movieDuration || show.TotalDuration) && (
            <div className="flex items-center gap-1">
              <FaClock className="text-yellow-500" />
              <span>{formatDuration(show.movieDuration || show.TotalDuration)}</span>
            </div>
          )}
        </div>

        {show.showType && (
          <p className="text-xs text-gray-500 mb-3">Type: {show.showType}</p>
        )}

        <button
          onClick={() => handleSelectShow(show)}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FaTicketAlt />
          Allot Tickets
        </button>
      </div>
    </div>
  )

  // ---- FULL SCREEN ALLOTMENT UI ----
  if (selectedShow) {
    return (
      <div className="w-full h-full text-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-700/50 shrink-0">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Shows</span>
          </button>
          <div className="ml-4 flex items-center gap-2">
            <FaTicketAlt className="text-yellow-500" />
            <h1 className="text-xl font-bold">Allot Tickets — {selectedShow.title}</h1>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDE — Form */}
          <div className="w-[380px] shrink-0 border-r border-gray-700/50 p-6 overflow-y-auto">
            {/* Show Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#1a1a2e] rounded-xl border border-gray-700/50">
              {selectedShow.Posterurl ? (
                <img src={selectedShow.Posterurl} alt={selectedShow.title} className="w-14 h-20 rounded-lg object-cover shadow-lg" />
              ) : (
                <div className="w-14 h-20 rounded-lg bg-gray-700 flex items-center justify-center">
                  <MdMovie className="text-2xl text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate">{selectedShow.title}</h3>
                <p className="text-gray-400 text-xs truncate">{selectedShow.tagline || 'No tagline'}</p>
                {selectedShow.genre?.genreName && (
                  <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                    {selectedShow.genre.genreName}
                  </span>
                )}
              </div>
            </div>

            {/* Theatre ID (auto-filled) */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FaTheaterMasks className="text-yellow-500" />
                Theatre ID
              </label>
              <input
                type="text"
                readOnly
                value={selectedTheatre?._id || ''}
                placeholder="Click a theatre on the right →"
                className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none cursor-default"
              />
              {selectedTheatre && (
                <p className="text-yellow-400 text-xs mt-1.5">
                  {selectedTheatre.theatrename || selectedTheatre.userName || selectedTheatre.name}
                </p>
              )}
            </div>

            {/* Total Tickets */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <MdConfirmationNumber className="text-yellow-500" />
                Total Tickets to Allot
              </label>
              <input
                type="number"
                min="1"
                value={totalToAllot}
                onChange={(e) => setTotalToAllot(e.target.value)}
                placeholder="Enter number of tickets"
                className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30 transition-all"
              />
            </div>

            {/* Summary */}
            {selectedTheatre && totalToAllot && (
              <div className="mb-5 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Allotment Summary</p>
                <p className="text-white text-sm">
                  <span className="text-yellow-400 font-bold">{Number(totalToAllot).toLocaleString('en-IN')}</span> tickets
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Theatre: {selectedTheatre.theatrename || selectedTheatre.userName || selectedTheatre.name}
                </p>
                <p className="text-gray-500 text-xs">Show: {selectedShow.title}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAllot}
                disabled={!selectedTheatre || !totalToAllot || submitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Allotting...
                  </>
                ) : (
                  <>
                    <FaTicketAlt />
                    Allot Tickets
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 text-gray-300 hover:text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — Theatres */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Select a Theatre</h2>

            {/* Theatres Loading */}
            {theatresLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-gray-400">Loading theatres...</span>
              </div>
            )}

            {/* Theatres Error */}
            {theatresError && !theatresLoading && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{theatresError}</p>
                <button onClick={fetchTheatres} className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline">
                  Try Again
                </button>
              </div>
            )}

            {/* Theatres Grid */}
            {!theatresLoading && !theatresError && theatres.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {theatres.map((theatre) => (
                  <div
                    key={theatre._id}
                    onClick={() => setSelectedTheatre(theatre)}
                    className={`bg-[#1a1a2e] border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTheatre?._id === theatre._id
                        ? 'border-yellow-500 shadow-yellow-500/10 shadow-lg'
                        : 'border-gray-700/50 hover:border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <FaTheaterMasks className="text-yellow-400" />
                      </div>
                      {selectedTheatre?._id === theatre._id && (
                        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                          <FaCheck className="text-black text-xs" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-semibold truncate">
                      {theatre.theatrename || theatre.userName || theatre.name || 'Theatre'}
                    </h3>
                    {(theatre.locationname || theatre.locationName) && (
                      <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt className="text-yellow-500 text-xs" />
                        {theatre.locationname || theatre.locationName}
                      </p>
                    )}
                    {theatre.email && (
                      <p className="text-gray-500 text-xs mt-1 truncate">{theatre.email}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty theatres */}
            {!theatresLoading && !theatresError && theatres.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-10 text-center max-w-md">
                  <FaTheaterMasks className="text-6xl text-yellow-500/30 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">No Theatres Found</h2>
                  <p className="text-gray-400 text-sm">There are no verified theatres available.</p>
                  <button onClick={fetchTheatres} className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm underline">
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ---- MAIN PAGE — Show Cards ----
  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaTicketAlt className="text-2xl text-yellow-500" />
        <h1 className="text-2xl md:text-3xl font-bold">Ticket Allotment</h1>
        <span className="ml-auto bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg text-sm font-semibold">
          {shows.length} Shows
        </span>
      </div>

      {/* Loading */}
      {showsLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-400">Loading shows...</span>
        </div>
      )}

      {/* Error */}
      {showsError && !showsLoading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{showsError}</p>
          <button onClick={fetchShows} className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {/* Shows Grid */}
      {!showsLoading && !showsError && shows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shows.map((show) => (
            <ShowCard key={show._id} show={show} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!showsLoading && !showsError && shows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
            <FaFilm className="text-8xl text-yellow-500/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">No Shows Found</h2>
            <p className="text-gray-400">There are no shows available right now.</p>
            <button onClick={fetchShows} className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm underline">
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketAllotment
