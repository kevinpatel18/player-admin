import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import CommonVenueLayout from "../CommonVenueLayout";
import { MyContext } from "../../../hooks/MyContextProvider";
import { toast } from "react-toastify";
import { getLocationDetails } from "../../../Libs/api";
import Loader from "../../../Component/Loader";

const LocationStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext);

  const [allLocation, setAllLocation] = useState([]);
  const [loading, setloading] = useState(true);

  const callAPI = useCallback(async () => {
    try {
      const apiCall = await getLocationDetails();
      if (apiCall.status) {
        setAllLocation(
          apiCall.data?.map((er) => ({
            ...er,
            locationId: er?.locationid,
          }))
        );
        setloading(false);
      } else {
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, []);

  useEffect(() => {
    callAPI();
    // eslint-disable-next-line
  }, []);

  const handleChange = (value) => {
    let obj = { ...contextData };
    obj.location = {
      locationId: value?.locationId,
      name: value?.name,
    };
    updateData(obj);
  };

  const handleNext = () => {
    if (!contextData?.location?.locationId) {
      toast.error("Please Select any One Location!");
    } else {
      updateStep("step6");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <CommonVenueLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Venue Location (City)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allLocation?.map((location) => (
              <div
                key={location.name}
                onClick={() => {
                  handleChange(location);
                }}
                className={`flex items-center space-x-2 border rounded-md p-3 ${
                  contextData?.location?.locationId === location?.locationId
                    ? "border-dark"
                    : ""
                }`}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    contextData?.location?.locationId ===
                      location?.locationId && "#F6F6F6",
                }}
              >
                <Input
                  type="checkbox"
                  id={location.name}
                  checked={
                    contextData?.location?.locationId === location?.locationId
                      ? true
                      : false
                  }
                />
                <label
                  htmlFor={location.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {location.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between " style={{ marginTop: 120 }}>
          <Button
            onClick={() => {
              updateStep("step4");
            }}
            className="bg-black text-white px-8 py-2 rounded"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              handleNext();
            }}
            className="bg-black text-white px-8 py-2 rounded"
          >
            Next
          </Button>
        </div>
      </div>
    </CommonVenueLayout>
  );
};

export default LocationStep;
