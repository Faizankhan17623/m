import React, { useState } from "react";
import Loader from "../extra/Loading";
import { useSelector } from "react-redux";
import Movies from "../../data/movies_data.json";

const PurchasedTickets = () => {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoggedIn, image } = useSelector((state) => state.auth);

  const postsPerPage = 5;
  const paginationNumbers = [];

  // Filtering logic for tabs
  const filteredMovies = Movies.filter((movie) => {
    // console.log(movie)
    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") return movie.progress 
    if (activeTab === "Completed") return movie.progress === 100;
    return true;
  });

  for (let i = 1; i <= Math.ceil(Movies.length / postsPerPage); i++) {
    paginationNumbers.push(i);
  }

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentMovies = Movies.slice(startIndex, endIndex);

  // Date helpers
  function parseDate(str) {
    const [day, month, year] = str.split("-");
    return new Date(`20${year}`, month - 1, day);
  }

  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-[#0f1117] min-h-screen text-white Main">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400  Home">
        Home <span className="text-gray-600 Texts">/</span> Dashboard{" "}
        <span className="text-gray-600 Texts">/</span>{" "}
        <span className="text-yellow-400 Texts">Purchased Tickets</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold Sixers">Purchased Tickets</h1>

      {/* Tabs */}
      <div className="flex space-x-4 Sixers">
        {["All", "Upcoming", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`Tabs rounded-md font-medium transition-colors ${
              activeTab === tab
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {/* Table Header */}
        <div className="grid grid-cols-5 TagLines text-gray-400 text-sm border-b border-gray-700 bg-gray-800 font-semibold uppercase tracking-wide">
          <span>Movie Name</span>
          <span>Show Date</span>
          <span className="text-center">Tickets</span>
          <span className="text-center">Price</span>
          <span className="text-center">Status</span>
        </div>

        {/* Table Rows */}
        {currentMovies.map((movie,index) => {
          const price = movie.total_tickets_purchased * movie.price;

          const today = new Date();
          const showDate = parseDate(movie.show_date);
          const todayDate = stripTime(today);
          const showDateOnly = stripTime(showDate);

          let status = "Upcoming";
          if (showDateOnly < todayDate) {
            status = "Expired";
          } else if (showDateOnly.getTime() === todayDate.getTime()) {
            status = "Released";
          }

          return (
            <div
              key={index}
              className="grid grid-cols-5 items-center Data border-b border-gray-800 hover:bg-gray-800/50 transition-colors px-4 py-3 relative"
            >
              {/* Movie Info */}
              <div className="flex items-center gap-3">
                <img
                  src={image}
                  alt={movie.movie_name}
                  className="w-12 h-12 rounded object-cover"
                />
                <span className="font-medium">{movie.movie_name}</span>
              </div>

              {/* Show Date */}
              <div className="text-gray-400 text-sm">
                {movie.show_date} {movie.show_time}
              </div>

              {/* Tickets */}
              <div className="text-center text-gray-300 Purchase">
                {movie.total_tickets_purchased}
              </div>

              {/* Price */}
              <div className="text-center text-gray-300 Progress ">₹{price}</div>

              {/* Status + Menu */}
              <div className="flex justify-center items-center gap-3 relative">
                <span
                  className={`text-sm px-2 py-1 Aaaa rounded-full ${
                    status === "Upcoming"
                      ? "bg-blue-500/20 text-blue-400"
                      : status === "Released"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {status}
                </span>

                {/* Menu */}
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === index ? null : index)
                  }
                  className="hover:bg-gray-700 p-1 rounded-full text-lg text-gray-400"
                >
                  ⋮
                </button>

                {menuOpen === index && (
                  <div className="absolute right-0 top-8 w-40 bg-gray-800 rounded-md shadow-lg z-50">
                    <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 Completion ">
                      View Full Details
                    </button>
                    <button className=" Completion  block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 Paginations">
        {paginationNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded transition-colors ${
              currentPage === num
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PurchasedTickets;
