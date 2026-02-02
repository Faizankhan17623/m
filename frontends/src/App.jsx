import Navbar from './Components/Home/Navbar'
import toast from 'react-hot-toast';
import Slider from './Components/Home/Slider'
import Finder from './Components/Home/Finder'
import Listing from './Components/Home/Listing';
import {  Routes, Route, Navigate} from "react-router-dom";
import About from './Components/Home/AboutUs'
import Contact from './Components/Home/contact'
import Join from './Components/UserCreation/Join'
import OPT from './Components/UserCreation/OTP'
import Login from './Components/Login/join'
import Forgot from './Components/Login/Forgot'
import Reset from './Components/Login/Reset'
import OpenRoute from './Hooks/OpenRoute'
import PrivateRoute from './Hooks/PrivateRoute';
import Dasboard from './Components/Dashboard/Connector'
import Movies from './Components/Movies/Heading'
import Theatres from './Components/Theatres/Heading'
import Profile from './Components/Dashboard/Profile'
import { useDispatch, useSelector } from 'react-redux'
// import Error from './Components/extra/Extra'
import {ACCOUNT_TYPE} from './utils/constants'
import Purchased from './Components/Dashboard/PurchasedTickets'
import Wishlist from './Components/Dashboard/Wishlist'
import History from './Components/Dashboard/PurchasedHistory'
import Tickets from './Components/Dashboard/Tickets'
import Settings from './Components/Dashboard/Settings'
import Right from './Components/Dashboard/RightSide'
import UserManage from './Components/Dashboard/UserManagement'
import Site from './Components/Dashboard/SiteSettings'
import Genre from './Components/Dashboard/Genres'
import Language from './Components/Dashboard/language'
import Users from './Components/Dashboard/Users'
import Error from './Components/extra/Extra'
import OrganizerVerificationForm from './Components/Dashboard/OrganizerVerificationForm'
import CookieConsent, { Cookies } from "react-cookie-consent";

const Homelayout = ({Notify}) =>{
  return(
    <div className={`bg-richblack-900 min-h-screen`}>
    <div className="max-w-[1440px] mx-auto px-4 overflow-hidden">
      <Navbar setColors={Notify}  />
      <div className="mt-6">
        <Slider />
      </div>
      <Finder />
    </div>
      <Listing/>
      <CookieConsent
  location="bottom"
  buttonText="Sure man!!"
  cookieName="myAwesomeCookieName2"
  style={{ background: "#2B373B" }}
  buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
  expires={150}
>
  This website uses cookies to enhance the user experience.{" "}
  <span style={{ fontSize: "10px" }}>This bit of text is smaller :O</span>
</CookieConsent>
     
  </div>
  )
}

const App = () => {
  const notify = () => toast.error('Work Under Progress !');

// const user = localStorage.getItem('userType')
const {user} = useSelector((state)=>state.profile)
const dispatch = useDispatch()


 if (user === null) {
    const storedUser = localStorage.getItem("userType");
    if (storedUser && !user) {
      return <div className="text-white text-center mt-10">Loading...</div>;
    }
  }



  return (
    <div className={`bg-richblack-800 min-h-screen`}>
      
      <Routes>

        <Route path='/' element={<Homelayout  Notify={notify}/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/SignUp' element={<Join/> }/>
        <Route path='/Login' element={ <Login/>}/>
        <Route path='/OTP' element={<OPT/>}/>

        <Route path='/Movies/:id' element={<Movies/>}/>
        <Route path='/Theatres/:id' element={<Theatres/>}/>

          <Route path='/Forgot-Password' element={
          // <OpenRoute>
            <Forgot/>
          // </OpenRoute> 
          }/>

        <Route path='/Reset-Password/:id' element={ 
          // <OpenRoute>
            <Reset/> 
          // </OpenRoute>
          }/>


<Route element={
  <PrivateRoute>
    <Dasboard /> {/* This is your Connector */}
  </PrivateRoute>
}>
  

  {/* Common to all */}
  <Route path="/Dashboard/My-Profile" element={<Profile />} />
  <Route path="/Dashboard/Settings" element={<Settings />} />

  {/* Viewer specific */}
{user?.usertype === ACCOUNT_TYPE.USER && (
    <>
      <Route path="/Dashboard/Purchased-Tickets" element={<Purchased />} />
      <Route path="/Dashboard/Wishlist" element={<Wishlist />} />
      <Route path="/Dashboard/Purchase-History" element={<History />} />
      <Route path="/Dashboard/Tickets" element={<Tickets />} />
    </>
  )}

  {/* Organizer specific */}
  {user?.usertype === ACCOUNT_TYPE.ORGANIZER && (
    <>
      <Route path="/Dashboard/Manage-Events" element={<div className='text-white'>Organizer Events Page</div>} />
      <Route path="/Dashboard/Shows" element={<div className='text-white'>Organizer Venues Page</div>} />
      <Route path="/Dashboard/My-Venues" element={<div className='text-white'>Organizer Venues Page</div>} />
      <Route path="/Dashboard/Organizer-Verification" element={<OrganizerVerificationForm />} />
    </>
  )}

  {/* Admin specific */}
  {user?.usertype === ACCOUNT_TYPE.ADMIN && (
    <>
      <Route path="/Dashboard/Verifications" element={<UserManage />} />
      <Route path="/Dashboard/Genre" element={<Genre />} />
      <Route path="/Dashboard/CreateLanguage" element={<Language/>} />
      <Route path="/Dashboard/VerifyShows" element={<div>This ist he Verify shows route</div>} />
      <Route path="/Dashboard/VerifyTheatre" element={<div>This ist he Verify theatre route</div>} />
      <Route path="/Dashboard/users" element={<Users/>} />
    </>
  )}

</Route>


<Route path='*' element={<Error/>}/>
    </Routes>
    </div>
  )
}

export default App
