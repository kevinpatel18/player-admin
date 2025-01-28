import React, { useContext, useState } from "react";
import loginImage from "../../assets/Images/Login.png";
import Logo from "../../assets/Images/Logo.png";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { MyContext } from "../../hooks/MyContextProvider";
import { loginApi } from "../../Libs/api";
import Loader from "../../Component/Loader";

export default function Login() {
  const { updateToken, updateUser } = useContext(MyContext);
  const navigate = useNavigate();

  const [loading, setloading] = useState(false);
  const [inputData, setInputData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [inputDataError, setInputDataError] = useState({
    phoneNumber: false,
    password: false,
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("qewqe");

    if (!inputData?.phoneNumber) {
      toast.error("Please Enter a Phone Number");
      setInputDataError({ ...inputDataError, phoneNumber: true });
    } else if (inputData?.phoneNumber?.length !== 10) {
      setInputDataError({ ...inputDataError, phoneNumber: true });
      toast.error("Please Enter a Phone Number in Proper Format");
    } else if (!inputData?.password) {
      setInputDataError({ ...inputDataError, password: true });
      toast.error("Please Enter a Password");
    } else if (inputData?.phoneNumber?.length <= 5) {
      setInputDataError({ ...inputDataError, password: true });
      toast.error("Please Enter a Password in Proper Format");
    } else {
      setloading(true);
      try {
        const apiCall = await loginApi(inputData);
        if (apiCall.status) {
          console.log(apiCall, "apiCall");

          setloading(false);
          updateToken(apiCall?.token);
          updateUser(apiCall?.userDetails);
          // updateStep("step10")
          navigate("/venue-configruation");
        } else {
          setloading(false);
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        setloading(false);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="">
      <main className="login-whole">
        <div className="image-holder p-4  hidden md:flex">
          <img style={{ borderRadius: 10 }} src={loginImage} alt="modern art" />
        </div>
        <div className="login-section">
          <div className="login">
            <div className="login-header">
              <img width={250} src={Logo} alt="modern art" />

              <div className="main-title mt-4">Welcome Back 👋</div>
              <div className="main-description">
                Enter your Phone Nunber and password to log in{" "}
              </div>
            </div>
            <div className="login-form">
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
                className="form"
                action=""
              >
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { m: 1 } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    error={inputDataError?.phoneNumber}
                    label="Phone Number"
                    type="number"
                    value={inputData?.phoneNumber}
                    onChange={(e) => {
                      setInputData({
                        ...inputData,
                        phoneNumber: e.target.value,
                      });
                      if (e.target.value?.length === 10) {
                        setInputDataError({
                          ...inputDataError,
                          phoneNumber: false,
                        });
                      } else {
                        setInputDataError({
                          ...inputDataError,
                          phoneNumber: true,
                        });
                      }
                    }}
                  />

                  <FormControl sx={{ m: 1 }} variant="outlined">
                    <InputLabel
                      error={inputDataError?.password}
                      htmlFor="outlined-adornment-password"
                    >
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      error={inputDataError?.password}
                      type={showPassword ? "text" : "password"}
                      value={inputData?.password}
                      onChange={(e) => {
                        setInputData({
                          ...inputData,
                          password: e.target.value,
                        });
                        if (e.target.value?.length >= 6) {
                          setInputDataError({
                            ...inputDataError,
                            password: false,
                          });
                        } else {
                          setInputDataError({
                            ...inputDataError,
                            password: true,
                          });
                        }
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Box>

                {/* <Link
                  className="forgot-password out-link bold "
                  style={{ textAlign: "right" }}
                  to=""
                >
                  Forgot password?
                </Link> */}
                <button
                  type="submit"
                  style={{
                    background: "#0044CA",
                    width: "100%",
                    height: 42,
                    gap: 0,
                    borderRadius: 10,
                    justifyContent: "space-between",
                    color: "white",
                    marginTop: 20,
                  }}
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
