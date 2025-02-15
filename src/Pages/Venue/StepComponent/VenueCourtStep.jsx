import React, { useContext } from 'react'
import { Button } from 'reactstrap'
import CommonVenueLayout from '../CommonVenueLayout'
import { MyContext } from '../../../hooks/MyContextProvider'
import { TextField } from '@mui/material'
import { toast } from 'react-toastify'





const VenueCourtStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext)
  console.log("contextData", contextData)
  const handleChange = (name, index, value) => {


    let obj = { ...contextData }
    let arr = [...obj.sportArray || []]
    arr[index][name] = value

    obj.sportArray = arr
    updateData(obj)
  }


  const handleNext = () => {
    let error = false;

    contextData?.sportArray?.map((er) => {
      if (!er?.noOfCourt) {
        toast.error("Please Enter a No of Court in " + er?.name + " !");
        error = true;
        return false;
      } else if (!er?.price) {
        toast.error("Please Enter a Price in " + er?.name + " !");
        error = true;
        return false;
      }
      return false;
    })


    if (!error) {
      updateStep("step4")
    }
  }


  return (
    <CommonVenueLayout >

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Venue Court</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 border rounded-md p-4">
            {contextData?.sportArray.map((sport, i) => (
              <div key={i}>


                <div className="flex gap-3 items-start ">


                  <TextField
                    fullWidth
                    type='number'
                    id="outlined-controlled"
                    label={`No of Court (${sport?.name} )`}
                    value={sport.noOfCourt}
                    onChange={(event) => {
                      handleChange("noOfCourt", i, event.target.value)
                    }}
                  />
                  <TextField
                    type='number'
                    fullWidth
                    id="outlined-controlled"
                    label={`Price (${sport?.name} )`}
                    value={sport.price}
                    onChange={(event) => {
                      handleChange("price", i, event.target.value)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between" style={{ marginTop: 120 }}>
          <Button onClick={() => { updateStep("step2") }} className="bg-black text-white px-8 py-2 rounded">Back</Button>
          <Button onClick={() => {
            handleNext()
          }} className="bg-black text-white px-8 py-2 rounded">Next</Button>
        </div>
      </div>
    </CommonVenueLayout>
  )
}

export default VenueCourtStep