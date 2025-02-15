import React, { useContext } from "react";
import Logo from "../../assets/Images/Logo.png";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { MyContext } from "../../hooks/MyContextProvider";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

const CommonVenueLayout = ({ children }) => {
  const { step } = useContext(MyContext);
  const getProgressPercentage = (step) => {
    const totalSteps = 9; // Assume we have 5 steps total
    const currentStep = parseInt(step.replace("step", ""));
    return (currentStep / totalSteps) * 100;
  };

  console.log("step", getProgressPercentage(step));
  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      {/* <header className="w-full flex justify-center  mb-12">
        <img src={Logo} alt='logo' height={40} />
      </header> */}

      <main className="w-full max-w-3xl">
        {step !== "step10" && (
          <>
            <BorderLinearProgress
              className="mb-10"
              variant="determinate"
              value={getProgressPercentage(step)}
            />

            <h2 className="text-3xl font-bold text-center mb-4">
              Welcome to Venue Management by Pllayer
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Lorem ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer.
            </p>
          </>
        )}
        {children}
      </main>
    </div>
  );
};

export default CommonVenueLayout;
