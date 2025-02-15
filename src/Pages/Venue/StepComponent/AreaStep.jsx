import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import CommonVenueLayout from "../CommonVenueLayout";
import { MyContext } from "../../../hooks/MyContextProvider";
import { toast } from "react-toastify";
import { getAreaDetails } from "../../../Libs/api";
import Loader from "../../../Component/Loader";

const AreaStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext);

  const [allArea, setAllArea] = useState([]);
  const [loading, setloading] = useState(true);

  const callAPI = useCallback(async () => {
    try {
      const apiCall = await getAreaDetails({
        locationId: contextData?.location?.locationId,
      });
      if (apiCall.status) {
        setAllArea(
          apiCall.data?.map((er) => ({
            ...er,
            areaId: er?.areaid,
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
    console.log('value: ', value);
    let obj = { ...contextData };
    obj.area = {
      areaId: value?.areaId,
      name: value?.name,
    };
    updateData(obj);
  };

  const handleNext = () => {
    if (!contextData?.area?.areaId) {
      toast.error("Please Select any One Area!");
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
          <h3 className="text-xl font-semibold mb-4">Venue Area </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allArea?.map((area) => (
              <div
                key={area.name}
                onClick={() => {
                  handleChange(area);
                }}
                className={`flex items-center space-x-2 border rounded-md p-3 ${
                  contextData?.area?.areaId === area?.areaId
                    ? "border-dark"
                    : ""
                }`}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    contextData?.area?.areaId ===
                      area?.areaId && "#F6F6F6",
                }}
              >
                <Input
                  type="checkbox"
                  id={area.name}
                  checked={
                    contextData?.area?.areaId === area?.areaId
                      ? true
                      : false
                  }
                />
                <label
                  htmlFor={area.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {area.name}
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

export default AreaStep;
