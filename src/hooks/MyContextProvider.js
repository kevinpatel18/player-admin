import React, { createContext, useState } from "react";
const MyContext = createContext();
const MyContextProvider = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [counter, setCounter] = useState(localStorage.getItem("counter") || 0);
  const [selectedCourt, setSelectedCourt] = useState(
    localStorage.getItem("selectedCourt")
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userDetails") || "{}")
  );
  const [selectedVenue, setSelectedVenue] = useState(
    JSON.parse(localStorage.getItem("selectedVenue") || "{}")
  );
  const [selectedSport, setSelectedSport] = useState(
    JSON.parse(localStorage.getItem("selectedSport") || "{}")
  );

  const [contextData, setContextData] = useState(
    JSON.parse(localStorage.getItem("contextData")) || {
      sportArray: [],
      location: {},
      area: {},
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
      password: "",
      staffPassword: "",
      isBookable: false,
    }
  );
  const [step, setStep] = useState(localStorage.getItem("step") || "step1");

  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateData = (newData) => {
    setContextData(newData);
    localStorage.setItem("contextData", JSON.stringify(newData));
  };
  const updateStep = (newData) => {
    setStep(newData);
    localStorage.setItem("step", newData);
  };

  const updateUser = (newData) => {
    setUser(newData);
    localStorage.setItem("userDetails", JSON.stringify(newData));
  };

  const updateToken = (newData) => {
    setToken(newData);
    localStorage.setItem("token", newData);
  };

  const updateSelectedCourt = (newData) => {
    setSelectedCourt(newData);
    localStorage.setItem("selectedCourt", newData);
  };
  const updateSelectedSport = (newData) => {
    setSelectedSport(newData);
    localStorage.setItem("selectedSport", JSON.stringify(newData));
  };

  const updateSelectedVenue = (newData) => {
    setSelectedVenue(newData);
    localStorage.setItem("selectedVenue", JSON.stringify(newData));
  };
  const updateCounter = (newData) => {
    setCounter(newData);
    localStorage.setItem("counter", newData);
  };

  return (
    <MyContext.Provider
      value={{
        contextData,
        updateData,
        step,
        updateStep,
        token,
        updateToken,
        user,
        updateUser,
        isCollapsed,
        setIsCollapsed,
        selectedVenue,
        updateSelectedVenue,
        selectedCourt,
        updateSelectedCourt,
        selectedSport,
        updateSelectedSport,
        openMenu,
        setOpenMenu,
        counter,
        updateCounter,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
