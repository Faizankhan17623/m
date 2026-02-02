import React, { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import {FaHeart  } from "react-icons/fa";


const Counter = () => {
 const counterRef = useRef(null);
  const [startCounter, setStartCounter] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounter(true);
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the component is visible
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  return (
    <div ref={counterRef} className='w-full flex justify-around items-center bg-richblack-700 h-[150px]'>
        
         <div className='flex flex-col justify-center items-center'>
            <div>
                <CountUp start={0} end={500} duration={2} redraw={true}>
            {({ countUpRef, start }) => {
                if (startCounter) start();
                return <span ref={countUpRef} className='text-3xl font-bold'/>;
            }}
            </CountUp>
            <span className='text-3xl gap-2'>+</span>
            </div>
            <p className='text-white text-lg'>Orgainezers</p>
        </div>

         <div className='flex flex-col justify-center items-center'>
            <div>
                <CountUp start={0} end={200} duration={2} redraw={true}>
            {({ countUpRef, start }) => {
                if (startCounter) start();
                return <span ref={countUpRef} className='text-3xl font-bold'/>;
            }}
            </CountUp>
            <span className='text-3xl gap-2'>+</span>
            </div>
            <p className='text-white text-lg'>No Of Theatre's</p>
        </div>

        <div className='flex flex-col justify-center items-center'>
            <div>
                <CountUp start={0} end={300} duration={2} redraw={true}>
            {({ countUpRef, start }) => {
                if (startCounter) start();
                return <span ref={countUpRef} className='text-3xl font-bold'/>;
            }}
            </CountUp>
            <span className='text-3xl gap-2'>+</span>
            </div>
            <p className='text-white text-lg'>Show's Done</p>
        </div>

        <div className='flex flex-col justify-center items-center'>
            <div>
                <CountUp start={0} end={10} duration={2} redraw={true}>
            {({ countUpRef, start }) => {
                if (startCounter) start();
                return <span ref={countUpRef}  className='text-3xl font-bold'/>;
            }}
            </CountUp>
            <span className='text-3xl font-bold'>k</span>
            </div>
            <p className='text-white text-lg flex justify-center items-center gap-3'>Happy Family<FaHeart className='text-xl fill-red-500'/></p>
        </div>
    </div>
  )
}

export default Counter