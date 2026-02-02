import { useState } from 'react'
import Navbar from '../Home/Navbar'
import Users from './User'
import Org from './Org'
import Loading from '../extra/Loading'
import Frame  from '../../assests/frame.png'
import Review from '../../assests/20250722_1919_Website Welcome Screen_remix_01k0s5zpfafgwtb2917cgvb6tk.png'

import review2 from '../../assests/20250722_1851_Grid Pattern Demo_remix_01k0s4hx3be05r0srqw6mksj47.png'

const Join = () => {
    const [User, setUser] = useState('User')
    const [loading, setLoading] = useState(false)

  // Handler for selecting User or Organizer
  const handleSelect = (type) => {
    setUser(type)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  // Decide which component to show
  let content = null
  if (User === 'User') {
    content = loading ? <Loading data={`relative top-10 left-50`}/> : <Users />
  } else if (User === 'Organizer') {
    content = loading ? <Loading data={`relative top-10 left-50`}/> : <Org />
  }

  return (
      <div className='w-full h-full flex flex-col justify-evenly items-center'>
        <Navbar />
        <div className='w-full h-full flex flex-row text-white justify-around items-center'>
          <div className='w-1/3 h-[500px] '>
            <div className='w-[400px]   h-1/3 flex  flex-col justify-around items-center'>
              <h1 className='text-bold text-2xl'>WELCOME BACK</h1>
            <p className='font-italic'>
              Discover Your Passion <br /> <span className='text-blue-100'>Be Unstoppable</span>
            </p>
              <div className='w-fit  h-14 flex justify-around items-center gap-1 rounded-3xl bg-richblack-400 Level2Btns'>
                <button onClick={() => handleSelect('User')} className={`hover:border-richblack-500 rounded-3xl w-40 h-14 ${
      User === 'User' ? 'bg-richblack-900 border-richblack-900 ' : 'bg-richblack-400'
    }`}>User</button>
                <button onClick={() => handleSelect('Organizer')} className={`hover:border-richblack-500 rounded-3xl w-40 h-14 ${
      User === 'Organizer' ? 'bg-richblack-900 border-richblack-900' : 'bg-richblack-400'
    }`}>Organizer</button>
              </div>
            </div>
            <div className='text-white'>
              {content}
            </div>
          </div>
          <div className='w-1/2 h-[450px] flex justify-center items-center'>
          {/* <div>
            <img src={Frame} alt="This is the  Frame" draggable="false" className='Sliders object-cover'/>
          </div>  */}
          <div>
            <img src={User === 'User'?Review:review2} alt="This is the image" draggable="false" className='w-[440px] rounded-md'/>
          </div>
          </div>
        </div>
      </div>
    )
}

export default Join