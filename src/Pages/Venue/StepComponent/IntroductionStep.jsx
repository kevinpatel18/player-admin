import React, { useContext } from 'react'
import Icon1 from "../../../assets/icon/Icon-1png.png"
import CommonVenueLayout from '../CommonVenueLayout'
import { MyContext } from '../../../hooks/MyContextProvider'

const IntroductionStep = () => {
  const {updateStep} = useContext(MyContext)
  return (
   

     <CommonVenueLayout >
      
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="flex items-start mb-8">
          <div className="mr-4 mt-1">
          <img src={Icon1} alt='logo' style= {{ height : 64 ,width:120}} />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Real-Time Management</h3>
            <p className="text-gray-600">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the 1500s, when
              an unknown printer.
            </p>
          </div>
        </div>
      ))}
      
      <div className="flex justify-center " style={{marginTop: 120}}>
        <button onClick={() => {updateStep("step2")}} className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
          Get Started & Setup Your Venue
        </button>
      </div>
  </CommonVenueLayout>
  )
}

export default IntroductionStep