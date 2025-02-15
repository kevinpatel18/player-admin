import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import CommonVenueLayout from "../CommonVenueLayout";
import { MyContext } from "../../../hooks/MyContextProvider";
import { toast } from "react-toastify";
import { getAllSportDetails } from "../../../Libs/api";
import Loader from "../../../Component/Loader";

const SportStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext);
  const [allSport, setAllSports] = useState([]);
  const [loading, setloading] = useState(true);

  const callAPI = useCallback(async () => {
    try {
      const apiCall = await getAllSportDetails();
      if (apiCall.status) {
        setAllSports(apiCall.data);
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
    console.log();
    let checked = contextData?.sportArray?.findIndex(
      (er) => er?.sportId === id
    );
    if (checked === -1) {
      let obj = { ...contextData };
      let arr = [...(obj.sportArray || [])];
      arr?.push({
        sportId: value.sportid,
        name: value?.name,
        noOfCourt: "",
        price: "",
      });

      obj.sportArray = arr;
      updateData(obj);
    } else {
      let obj = { ...contextData };
      let arr = obj.sportArray.filter((er) => er.sportId !== value?.sportid);
      obj.sportArray = arr;

      updateData(obj);
    }
  };

  const handleNext = () => {
    if (contextData?.sportArray?.length === 0) {
      toast.error("Please Select any One Sport!", { toastId: "sportArray" });
    } else {
      updateStep("step3");
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <CommonVenueLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Select available sports on your venue.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allSport.map((sport) => (
              <div
                key={sport.name}
                onClick={() => {
                  handleChange(sport.sportid, sport);
                }}
                className={`flex items-center space-x-2 border rounded-md p-3 ${
                  contextData?.sportArray?.find(
                    (er) => er?.sportId === sport.sportid
                  )
                    ? "border-dark"
                    : ""
                }`}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    contextData?.sportArray?.find(
                      (er) => er?.sportId === sport.sportid
                    ) && "#F6F6F6",
                }}
              >
                <Input
                  onClick={() => {
                    handleChange(sport.sportid, sport);
                  }}
                  type="checkbox"
                  id={sport.name}
                  checked={
                    contextData?.sportArray?.find(
                      (er) => er?.sportId === sport.sportid
                    )
                      ? true
                      : false
                  }
                />
                <label
                  onClick={() => {
                    handleChange(sport.sportid, sport);
                  }}
                  htmlFor={sport.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {sport.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between" style={{ marginTop: 120 }}>
          <Button
            onClick={() => {
              updateStep("step1");
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

export default SportStep;
