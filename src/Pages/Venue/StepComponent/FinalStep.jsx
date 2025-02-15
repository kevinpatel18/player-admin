import React, { useContext } from "react";
import { Button, Card } from "reactstrap";
import CommonVenueLayout from "../CommonVenueLayout";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../hooks/MyContextProvider";

const FinalStep = () => {
  const navigate = useNavigate();
  const { updateStep, updateData } = useContext(MyContext);
  return (
    <CommonVenueLayout>
      <div className="flex flex-col items-center justify-center bg-white">
        {/* <img src="/placeholder.svg" alt="Logo" className="mb-8" /> */}

        <Card className="w-full max-w-sm p-6 mt-10 shadow-lg custom-submit">
          <svg
            style={{ position: "absolute", top: 0, left: 0, opacity: 0.2 }}
            width="100%"
            height="221"
            viewBox="0 0 444 221"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M239 172.5C134.2 140.5 36 191.5 0 221H-22V-35H444C444.167 -0.833332 444.4 73.4 444 97C443.5 126.5 370 212.5 239 172.5Z"
              fill="url(#paint0_linear_225_695)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_225_695"
                x1="211.11"
                y1="71.5"
                x2="211.11"
                y2="221"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="1" stop-color="#00A624" />
              </linearGradient>
            </defs>
          </svg>

          <div
            className="flex justify-center mb-4 mt-20"
            style={{ marginTop: 75 }}
          >
            <div className="relative">
              <svg
                width="152"
                height="140"
                viewBox="0 0 152 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="69.5" cy="70.5" r="69.5" fill="#E4FBE9" />
                <circle cx="69.5" cy="70.5" r="49.5" fill="#3EB34A" />
                <path
                  d="M51 71L63.6702 84L89 58"
                  stroke="white"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="130"
                  y="9.3418"
                  width="8.80488"
                  height="2.31707"
                  rx="1.15854"
                  fill="#3EB34A"
                />
                <rect
                  x="151.781"
                  y="11.6582"
                  width="8.80488"
                  height="2.31707"
                  rx="1.15854"
                  transform="rotate(-180 151.781 11.6582)"
                  fill="#3EB34A"
                />
                <rect
                  x="142.047"
                  width="8.80488"
                  height="2.31707"
                  rx="1.15854"
                  transform="rotate(90 142.047 0)"
                  fill="#3EB34A"
                />
                <rect
                  x="139.734"
                  y="20.8047"
                  width="8.80488"
                  height="2.31707"
                  rx="1.15854"
                  transform="rotate(-90 139.734 20.8047)"
                  fill="#3EB34A"
                />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h1 className="mb-2 text-xl font-semibold">
              Request Submitted <br /> successfully
            </h1>
            <p className="mb-6 text-gray-600">
              Our Team will get back to you soon
            </p>
            <Button
              onClick={() => {
                localStorage.removeItem("contextData");
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
                });
                navigate("/manage-venue");
                updateStep("step1");
              }}
              className="w-full mb-4 bg-blue-600 text-white"
            >
              Done
            </Button>
          </div>
        </Card>
      </div>
    </CommonVenueLayout>
  );
};

export default FinalStep;
