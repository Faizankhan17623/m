import React from 'react'

const AboutUs = () => {
  return (
    <div className='w-full flex flex-row justify-around items-center h-breakpoint-sm '>
        <div className='w-[50%] h-[90%] gap-3 flex flex-col justify-center items-center'>
            <h1 className='text-7xl font-mono'>Discover More About Us</h1>
            <span className="line inline-block w-20 h-[2px] bg-white pl-[100px]"></span>

            <p className='font-mono'>Welcome To the Cine Circuit Website we are an Movie Ticket Booking Companey that helps the Creater of the movies to distribute the ticket's to the right People So that they can help you to reach a massive amount of audience and help you to get more views using our right ways and help the Orgainezer and the Theatrer To Register with us and take their platform online and get more customer that will be helpfull for the succesfull running off Your own business Do love our platform and if you like it please Refer us to the other peoples Thank You</p>

            <div  className=' font-mono gap-5 w-[400px] flex justify-around items-center '>
                <a href="/" className='text-xl'>Ask A Question</a>
                <a href="/" className='text-xl'>Know More</a>
            </div>

            <button className='About_Button  rounded-lg bg-grey-200'>Discover More</button>
        </div>
        <img src={'https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976712/Know_more_krxlwz.png'} alt="This is the know More" className='h-[300px] w-[20%] rounded-md' loading='lazy'/>
    </div>
  )
}

export default AboutUs