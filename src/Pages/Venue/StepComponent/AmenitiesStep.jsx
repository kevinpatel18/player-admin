import React, { useCallback, useContext, useEffect, useState } from "react";
import { MyContext } from "../../../hooks/MyContextProvider";
import CommonVenueLayout from "../CommonVenueLayout";
import { Button } from "reactstrap";
import { getAmenitiesDetails } from "../../../Libs/api";
import { toast } from "react-toastify";
import Loader from "../../../Component/Loader";

const AmenitiesStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext);
  const [allAmenities, setAllAmenities] = useState([]);
  const [loading, setloading] = useState(true);

  const callAPI = useCallback(async () => {
    try {
      const apiCall = await getAmenitiesDetails();
      if (apiCall.status) {
        setAllAmenities(apiCall.data);
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

  const handleChange = (id, value) => {
    let checked = contextData?.amenitiesArray?.findIndex(
      (er) => er?.amenitiesId === id
    );
    if (checked === -1) {
      let obj = { ...contextData };
      let arr = [...(obj.amenitiesArray || [])];
      arr?.push({
        amenitiesId: value.amenitiesid,
        name: value?.name,
      });

      obj.amenitiesArray = arr;
      updateData(obj);
    } else {
      let obj = { ...contextData };
      let arr = obj.amenitiesArray.filter(
        (er) => er.amenitiesId !== value?.amenitiesid
      );
      obj.amenitiesArray = arr;

      updateData(obj);
    }
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <CommonVenueLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Popular Amenities.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allAmenities.map((amenitie, i) => (
                <div
                  key={amenitie.name}
                  onClick={() => {
                    handleChange(amenitie.amenitiesid, amenitie);
                  }}
                  className={`flex items-center space-x-2 border rounded-md p-3 ${
                    contextData?.amenitiesArray?.find(
                      (er) => er?.amenitiesId === amenitie.amenitiesid
                    )
                      ? "border-dark"
                      : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      contextData?.amenitiesArray?.find(
                        (er) => er?.amenitiesId === amenitie.amenitiesid
                      ) && "#F6F6F6",
                  }}
                >
                  <img alt={`image-${i}`} src={`${amenitie.image}`} />
                  <label
                    htmlFor={amenitie.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenitie.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between" style={{ marginTop: 120 }}>
            <Button
              onClick={() => {
                updateStep("step3");
              }}
              className="bg-black text-white px-8 py-2 rounded"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                updateStep("step5");
              }}
              className="bg-black text-white px-8 py-2 rounded"
            >
              Next
            </Button>
          </div>
        </div>
      </CommonVenueLayout>
    );
  }
};

export default AmenitiesStep;
