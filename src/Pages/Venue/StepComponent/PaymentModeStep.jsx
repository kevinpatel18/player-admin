import React, { useContext } from 'react'
import { Button, Input } from 'reactstrap'
import CommonVenueLayout from '../CommonVenueLayout'
import { MyContext } from '../../../hooks/MyContextProvider'
import { toast } from 'react-toastify';


const PaymentModeStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext)
  console.log("contextData", contextData)

  const handleChange = (value) => {
    let obj = { ...contextData }
    obj.paymentMode = value
    updateData(obj)
  }


  const handleNext = () => {
    console.log(contextData?.locationArray || []?.length)
    if (!contextData?.paymentMode) {
      toast.error("Please Select Payment Mode!")
    } else {
      updateStep("step7")
    }
  }


  return (
    <CommonVenueLayout >

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Payment Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div onClick={() => {
              handleChange("online")
            }} className={`flex items-center space-x-2 border rounded-md p-3 ${contextData?.paymentMode === "online" ? "border-dark" : ""}`} style={{ cursor: "pointer", backgroundColor: contextData?.paymentMode === "online" && "#F6F6F6" }} >

              <Input type='radio' checked={contextData?.paymentMode === "online"} />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Online (UPI/Card)
              </label>



            </div>
            <div onClick={() => {
              handleChange("cash")
            }} className={`flex items-center space-x-2 border rounded-md p-3 ${contextData?.paymentMode === "cash" ? "border-dark" : ""}`} style={{ cursor: "pointer", backgroundColor: contextData?.paymentMode === "cash" && "#F6F6F6" }} >

              <Input type='radio' checked={contextData?.paymentMode === "cash"} />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Offline (Cash)
              </label>



            </div>
          </div>
        </div>


        <div className="flex justify-between " style={{ marginTop: 120 }}>
          <Button onClick={() => { updateStep("step5") }} className="bg-black text-white px-8 py-2 rounded">Back</Button>
          <Button onClick={() => { handleNext() }} className="bg-black text-white px-8 py-2 rounded">Next</Button>
        </div>
      </div>
    </CommonVenueLayout>
  )
}

export default PaymentModeStep