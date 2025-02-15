import React, { useContext, useEffect } from "react";
import IntroductionStep from "./StepComponent/IntroductionStep";
import SportStep from "./StepComponent/SportStep";
import VenueCourtStep from "./StepComponent/VenueCourtStep";
import LocationStep from "./StepComponent/LocationStep";
import AmenitiesStep from "./StepComponent/AmenitiesStep";
import { MyContext } from "../../hooks/MyContextProvider";
import FormStep from "./StepComponent/FormStep";
import AboutVenueStep from "./StepComponent/AboutVenueStep";
import CancellationPolicyStep from "./StepComponent/CancellationPolicyStep";
import VenueImagesStep from "./StepComponent/VenueImagesStep";
import FinalStep from "./StepComponent/FinalStep";
const AddVenue = () => {
  const { step, updateStep, updateData } = useContext(MyContext);

  useEffect(() => {
    if (!step) {
      updateStep("step1");
      updateData({
        sportArray: [],
        location: {},
        amenitiesArray: [],
        paymentMode: "",
        ownerName: "",
        phone: "",
        email: "",
        alternativePhoneNo: "",
        venueName: "",
        address: "",
        addressUrl: "",
        aboutVenue: "",
        cancellationPolicy: "",
        imageArray: [],
        isBookable: false,
      });
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      {step === "step1" && <IntroductionStep />}

      {step === "step2" && <SportStep />}
      {step === "step3" && <VenueCourtStep />}
      {step === "step4" && <AmenitiesStep />}
      {step === "step5" && <LocationStep />}
      {step === "step6" && <FormStep />}
      {step === "step7" && <AboutVenueStep />}
      {step === "step8" && <CancellationPolicyStep />}
      {step === "step9" && <VenueImagesStep />}
      {step === "step10" && <FinalStep />}
    </div>
  );
};

export default AddVenue;
