import React, { useCallback, useContext, useState } from "react";
import { Image } from "lucide-react";
import { Button, Card } from "reactstrap";
import CommonVenueLayout from "../CommonVenueLayout";
import { MyContext } from "../../../hooks/MyContextProvider";
import { toast } from "react-toastify";
import { storeVenue } from "../../../Libs/api";
import Loader from "../../../Component/Loader";

const VenueImagesStep = () => {
  const { contextData, updateStep, user } = useContext(MyContext);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setloading] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndAddFiles = (newFiles) => {
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const availableSlots = 10 - files.length;
    const filesToAdd = imageFiles.slice(0, availableSlots);

    if (newFiles.length !== imageFiles.length) {
      toast.error("Only image files are allowed.");
    }

    if (files.length + filesToAdd.length > 10) {
      console.log("Asdasd");
      toast.error("You can upload a maximum of 10 images.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    }
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateAndAddFiles(Array.from(e.dataTransfer.files));
      }
      //   eslint-disable-next-line
    },
    [files]
  );

  const onFileChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        validateAndAddFiles(Array.from(e.target.files));
      }
      //   eslint-disable-next-line
    },
    [files]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    let arr = [];
    contextData?.sportArray?.map((er) => {
      arr?.push({
        sportId: er?.sportId,
        noOfCourt: +er?.noOfCourt,
        pricePerHour: +er?.price,
      });

      return false;
    });
    console.log(arr);
    let formData = new FormData();

    formData.append("name", contextData?.venueName);
    formData.append("address", contextData?.address);
    formData.append("addressUrl", contextData?.addressUrl);
    formData.append("description", contextData?.aboutVenue);
    formData.append("locationId", contextData?.location?.locationId);
    formData.append("areaId", contextData?.area?.areaId);
    formData.append(
      "amenities",
      JSON.stringify(contextData?.amenitiesArray?.map((er) => er?.amenitiesId))
    );

    formData.append("isFavourite", true);
    formData.append("cancellationPolicy", contextData?.cancellationPolicy);
    formData.append("ownerName", contextData?.ownerName);
    formData.append("email", contextData?.email);
    formData.append("phoneNo", contextData?.phone);
    formData.append("alternativePhoneNo", contextData?.alternativePhoneNo);
    formData.append("sportArray", JSON.stringify(arr));
    formData.append("userId", user?.userid);
    formData.append("password", contextData?.password);
    formData.append("staffPassword", contextData?.staffPassword);
    formData.append("isBookable", contextData?.isBookable || false);

    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        formData.append("images", element);
      }
    }

    try {
      const apiCall = await storeVenue(formData);
      if (apiCall.status) {
        console.log(apiCall, "apiCall");

        setloading(false);
        updateStep("step10");
      } else {
        setloading(false);

        toast.error(apiCall?.message);
      }
    } catch (error) {
      setloading(false);

      console.log(error);
      toast.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <CommonVenueLayout>
      <div className="max-w-4xl mx-auto">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Image className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">Drag and drop</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or browse for photos
          </p>
          <Button
            variant="secondary"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Browse
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={onFileChange}
            accept="image/*"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-7">
          {files?.map((item, i) => (
            <Card
              key={i}
              className="aspect-video flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <img src={URL?.createObjectURL(item)} alt={`image-${i}`} />
              <Button
                color="danger"
                className="mt-2"
                onClick={(e) => {
                  let arr = [...files];
                  arr.splice(i, 1);
                  setFiles(arr);
                }}
              >
                Remove
              </Button>
            </Card>
          ))}
        </div>
        <div></div>
        <div className="flex justify-between " style={{ marginTop: 120 }}>
          <Button
            onClick={() => {
              updateStep("step6");
            }}
            className="bg-black text-white px-8 py-2 rounded"
          >
            Back
          </Button>
          <Button
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="bg-black text-white px-8 py-2 rounded"
          >
            Publish Venue for Booking
          </Button>
        </div>
      </div>
    </CommonVenueLayout>
  );
};

export default VenueImagesStep;
