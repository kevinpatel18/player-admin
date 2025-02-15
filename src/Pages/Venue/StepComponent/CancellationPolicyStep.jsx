import React, { useContext } from 'react'
import { Button, Input } from 'reactstrap'
import CommonVenueLayout from '../CommonVenueLayout'
import { MyContext } from '../../../hooks/MyContextProvider'
import { toast } from 'react-toastify';


const CancellationPolicyStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext)


  const handleChange = (value) => {
    let obj = { ...contextData }
    obj.cancellationPolicy = value;
    updateData(obj)

  }

  const handleNext = () => {
    if (!contextData?.cancellationPolicy) {
      toast.error("Please Enter a Cancellation Policy & Venue Rules!")
    } else {
      updateStep("step9")
    }
  }


  return (
    <CommonVenueLayout >

      <div className="max-w-4xl mx-auto">
        <section>
          <h2 className="text-lg font-medium mb-2">Cancellation Policy & Venue Rules</h2>
          <Input type="textarea"
            placeholder="Write your description"
            value={contextData?.cancellationPolicy}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[200px] mb-2"
            rows={8}
          />
        </section>

        <div className="flex justify-between " style={{ marginTop: 120 }}>
          <Button onClick={() => { updateStep("step7") }} className="bg-black text-white px-8 py-2 rounded">Back</Button>
          <Button onClick={() => { handleNext() }} className="bg-black text-white px-8 py-2 rounded">Next</Button>
        </div>
      </div>
    </CommonVenueLayout>
  )
}

export default CancellationPolicyStep