import React, { useContext, useState } from "react";
import { Button, Input, Label } from "reactstrap";
import CommonVenueLayout from "../CommonVenueLayout";
import { MyContext } from "../../../hooks/MyContextProvider";
import { toast } from "react-toastify";
import { Switch, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Plus, Trash2 } from "lucide-react";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#0044CA",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

const FormStep = () => {
  const { contextData, updateData, updateStep } = useContext(MyContext);
  console.log("contextData", contextData);

  const [inputError, setInputError] = useState({
    ownerName: false,
    phone: false,
    email: false,
    venueName: false,
    address: false,
    addressUrl: false,
    password: false,
    staffPassword: false,
    isBookable: false,
    whatsappMobileNo: false,
  });

  const handleChange = (name, value) => {
    let obj = { ...contextData };
    obj[name] = value;
    updateData(obj);

    setInputError({ ...inputError, [name]: false });
  };

  const handleNext = () => {
    console.log(contextData?.locationArray || []?.length);
    if (!contextData?.ownerName) {
      toast.error("Please Enter a Owner Name!");
      setInputError({ ...inputError, ownerName: true });
    } else if (!contextData?.phone) {
      toast.error("Please Enter a Phone Number!");
      setInputError({ ...inputError, phone: true });
    } else if (contextData?.phone?.length !== 10) {
      toast.error("Please Enter a Phone Number in Proper Format!");
      setInputError({ ...inputError, phone: true });
    } else if (!contextData?.email) {
      toast.error("Please Enter a Email");
      setInputError({ ...inputError, email: true });
    } else if (!contextData?.venueName) {
      toast.error("Please Enter a Venue Name!");
      setInputError({ ...inputError, venueName: true });
    } else if (!contextData?.address) {
      toast.error("Please Enter a Address!");
      setInputError({ ...inputError, address: true });
    } else if (!contextData?.addressUrl) {
      toast.error("Please Enter a Google Map Url!");
      setInputError({ ...inputError, addressUrl: true });
    } else if (!contextData?.password) {
      toast.error("Please Enter a Password!");
      setInputError({ ...inputError, password: true });
    } else if (!contextData?.staffPassword) {
      toast.error("Please Enter a Staff Password!");
      setInputError({ ...inputError, staffPassword: true });
    } else if (contextData?.whatsappMobileNo?.length < 1) {
      toast.error("Please Enter atleast one Whatsapp Number!");
    } else {
      let error = false;

      contextData?.whatsappMobileNo?.map((er) => {
        if (er?.length !== 10) {
          toast.error("Please Enter a Phone Number in Proper Format!");
          error = true;
        }
      });

      if (!error) {
        updateStep("step7");
      }
    }
  };

  return (
    <CommonVenueLayout>
      <div className="max-w-4xl mx-auto">
        <form className="space-y-4">
          <h2 className="text-xl font-semibold">Enter your details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="mb-0" htmlFor="owner-name">
                Owner Full Name*
              </Label>
              <Input
                id="owner-name"
                style={{ border: inputError?.ownerName && "1px solid red" }}
                type="text"
                value={contextData?.ownerName}
                name="ownerName"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label className="mb-0" htmlFor="phone">
                Phone*
              </Label>
              <Input
                id="phone"
                style={{ border: inputError?.phone && "1px solid red" }}
                placeholder="00000 00000"
                type="number"
                value={contextData?.phone}
                name="phone"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="mb-0" htmlFor="email">
                Email ID*
              </Label>
              <Input
                id="email"
                style={{ border: inputError?.email && "1px solid red" }}
                type="email"
                placeholder="Enter your Email"
                value={contextData?.email}
                name="email"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="mb-0" htmlFor="alternate-phone">
                Alternate Phone (Optional)
              </Label>
              <Input
                id="alternate-phone"
                placeholder="+91 - 00000 00000"
                type="number"
                value={contextData?.alternativePhoneNo}
                name="alternativePhoneNo"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="mb-0" htmlFor="venue-name">
              Venue Name*
            </Label>
            <Input
              id="venue-name"
              style={{ border: inputError?.venueName && "1px solid red" }}
              placeholder="Enter your venue name"
              type="text"
              value={contextData?.venueName}
              name="venueName"
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label className="mb-0" htmlFor="address">
              Address*
            </Label>
            <Input
              id="address"
              style={{ border: inputError?.address && "1px solid red" }}
              placeholder="Enter venue address"
              type="text"
              value={contextData?.address}
              name="address"
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label className="mb-0" htmlFor="address">
              Google Map Url *
            </Label>
            <Input
              id="address"
              style={{ border: inputError?.addressUrl && "1px solid red" }}
              placeholder="Enter Google Map"
              type="text"
              value={contextData?.addressUrl}
              name="addressUrl"
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="mb-0" htmlFor="owner-name">
                Password*
              </Label>
              <Input
                id="owner-name"
                style={{ border: inputError?.password && "1px solid red" }}
                type="text"
                value={contextData?.password}
                name="password"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                placeholder="Enter your Password"
              />
            </div>
            <div className="space-y-2">
              <Label className="mb-0" htmlFor="phone">
                Staff Password*
              </Label>
              <Input
                id="phone"
                style={{ border: inputError?.staffPassword && "1px solid red" }}
                placeholder="Enter your Password"
                type="text"
                value={contextData?.staffPassword}
                name="staffPassword"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={contextData?.isBookable}
                    onChange={(e) => {
                      handleChange("isBookable", e.target.checked);
                    }}
                  />
                }
                label={"Is Bookable ?"}
                labelPlacement="start"
                // sx={{ width: isTablet ? "auto" : "15%", textWrap: "nowrap" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Label className="mb-0" htmlFor="phone">
              Whatsapp Number *
            </Label>{" "}
            <div
              style={{
                background: "black",
                padding: 5,
                borderRadius: 6,
              }}
              onClick={() => {
                let obj = { ...contextData };
                let arr = [...obj.whatsappMobileNo];

                arr.push("");

                obj["whatsappMobileNo"] = arr;

                updateData(obj);
              }}
            >
              <Plus size={20} className="cursor-pointer text-white" />
            </div>
          </div>

          <div
            style={{ marginTop: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {contextData?.whatsappMobileNo?.map((item, i) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                }}
              >
                <div className="">
                  <Input
                    id="phone"
                    style={{ border: inputError?.phone && "1px solid red" }}
                    placeholder="00000 00000"
                    type="number"
                    value={item}
                    name="phone"
                    onChange={(e) => {
                      let obj = { ...contextData };
                      let arr = [...obj.whatsappMobileNo];

                      arr[i] = e.target.value;

                      obj["whatsappMobileNo"] = arr;

                      updateData(obj);
                    }}
                  />
                </div>

                <div
                  style={{
                    background: "black",
                    padding: 5,
                    borderRadius: 6,
                  }}
                  onClick={() => {
                    let obj = { ...contextData };
                    let arr = [...obj.whatsappMobileNo];

                    arr.splice(i, 1);

                    obj["whatsappMobileNo"] = arr;

                    updateData(obj);
                  }}
                >
                  <Trash2 size={20} className="cursor-pointer text-white" />
                </div>
              </div>
            ))}
          </div>
        </form>

        <div className="flex justify-between " style={{ marginTop: 120 }}>
          <Button
            onClick={() => {
              updateStep("step5");
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

export default FormStep;
