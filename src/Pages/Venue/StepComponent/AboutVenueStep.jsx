import React, { useContext } from 'react'
import { Button, Input } from 'reactstrap'
import CommonVenueLayout from '../CommonVenueLayout'
import { MyContext } from '../../../hooks/MyContextProvider'
import { toast } from 'react-toastify';


const AboutVenueStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext)

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value
    const newWordCount = newDescription.trim().length

    if (newWordCount <= 1000) {
      let obj = { ...contextData }
      obj.aboutVenue = newDescription;
      updateData(obj)
    }
  }

  const handleNext = () => {
    console.log(contextData?.locationArray || []?.length)
    if (!contextData?.aboutVenue) {
      toast.error("Please Enter a About Venue!")
    } else {
      updateStep("step8")
    }
  }


  return (
    <CommonVenueLayout >

      <div className="max-w-4xl mx-auto">
        <section>
          <h2 className="text-lg font-medium mb-2">About Venue</h2>
          <Input type="textarea"
            placeholder="Write your description"
            value={contextData?.aboutVenue}
            onChange={handleDescriptionChange}
            className="min-h-[200px] mb-2"
            rows={8}
          />
          <div className="text-sm text-gray-500 text-right">{contextData?.aboutVenue.trim()?.length}/1000</div>
        </section>

        <div className="flex justify-between " style={{ marginTop: 120 }}>
          <Button onClick={() => { updateStep("step6") }} className="bg-black text-white px-8 py-2 rounded">Back</Button>
          <Button onClick={() => { handleNext() }} className="bg-black text-white px-8 py-2 rounded">Next</Button>
        </div>
      </div>
    </CommonVenueLayout>
  )
}

export default AboutVenueStep