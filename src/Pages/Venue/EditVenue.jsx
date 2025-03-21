import React, { useCallback, useContext, useEffect, useState } from "react";

import moment from "moment";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import { toast } from "react-toastify";
import Loader from "../../Component/Loader";
import {
  Box,
  Modal,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
  Grid,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { getAmenitiesDetails, updateVenueDetails } from "../../Libs/api";
import { setISODay } from "date-fns";
import { MyContext } from "../../hooks/MyContextProvider";
import useBreakPoints from "../../hooks/useBreakPoints";
import { Plus, Trash2 } from "lucide-react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const EditVenue = ({ open, setOpen, handleCallBackApi, selectedVenue }) => {
  console.log("selectedVenue: ", selectedVenue);
  const { isTablet, isMobile } = useBreakPoints();
  const { user } = useContext(MyContext);
  const [loading, setloading] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);

  const [inputData, setInputData] = useState({
    name: selectedVenue?.name,
    address: selectedVenue?.address,
    addressUrl: selectedVenue?.addressUrl,
    description: selectedVenue?.description,
    amenities: selectedVenue?.amenities,
    cancellationPolicy: selectedVenue?.cancellationPolicy,
    images: selectedVenue?.images,
    ownerName: selectedVenue?.ownerName,
    email: selectedVenue?.email,
    phoneNo: selectedVenue?.phoneNo,
    alternativePhoneNo: selectedVenue?.alternativePhoneNo,
    location: selectedVenue?.location,
    preamount: selectedVenue?.preamount,
    maxdays: selectedVenue?.maxdays,
    isBookable: selectedVenue?.isBookable,
    isFeatured: selectedVenue?.isFeatured,
    position: selectedVenue?.position,
    whatsappMobileNo: JSON.parse(selectedVenue?.whatsappMobileNo || '[""]'),
    password: "",
    staffPassword: "",
  });
  console.log("inputData: ", inputData);

  const [inputDataError, setInputDataError] = useState({
    name: false,
    address: false,
    addressUrl: false,
    description: false,
    amenities: false,
    cancellationPolicy: false,
    images: false,
    ownerName: false,
    email: false,
    phoneNo: false,
    alternativePhoneNo: false,
    location: false,
    preamount: false,
    maxdays: false,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputData?.name) {
      toast.error("Please Enter a name");
      setInputDataError({ ...inputDataError, name: true });
    } else if (!inputData?.address) {
      toast.error("Please Enter a Address");
      setInputDataError({ ...inputDataError, address: true });
    } else if (!inputData?.addressUrl) {
      toast.error("Please Enter a Address Url");
      setInputDataError({ ...inputDataError, addressUrl: true });
    } else if (!inputData?.description) {
      toast.error("Please Enter a Description");
      setInputDataError({ ...inputDataError, description: true });
    } else if (!inputData?.cancellationPolicy) {
      toast.error("Please Enter a Cancellation Policy");
      setInputDataError({ ...inputDataError, cancellationPolicy: true });
    } else if (!inputData?.ownerName) {
      toast.error("Please Enter a Owner Name");
      setInputDataError({ ...inputDataError, ownerName: true });
    } else if (!inputData?.email) {
      toast.error("Please Enter a Email");
      setInputDataError({ ...inputDataError, email: true });
    } else if (!inputData?.phoneNo) {
      toast.error("Please Enter a Phone Number!");
      setInputDataError({ ...inputDataError, phoneNo: true });
    } else if (inputData?.phoneNo?.length !== 10) {
      toast.error("Please Enter a Phone Number in Proper Format!");
      setInputDataError({ ...inputDataError, phoneNo: true });
    } else if (inputData?.whatsappMobileNo?.length < 1) {
      toast.error("Please Enter atleast one Whatsapp Number!");
    } else {
      let error = false;

      inputData?.whatsappMobileNo?.map((er) => {
        if (er?.length !== 10) {
          toast.error("Please Enter a Phone Number in Proper Format!");
          error = true;
        }
      });

      if (!error) {
        let formData = {
          ...inputData,
          whatsappMobileNo: JSON.stringify(inputData?.whatsappMobileNo),
        };
        console.log("formData: ", formData);

        try {
          const apiCall = await updateVenueDetails(
            formData,
            selectedVenue?.venueId
          );
          if (apiCall.status) {
            console.log(apiCall, "apiCall");

            setloading(false);
            setOpen(false);
            handleCallBackApi();
          } else {
            setloading(false);

            toast.error(apiCall?.message);
          }
        } catch (error) {
          setloading(false);

          console.log(error);
          toast.error(error);
        }
      }
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {loading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? 350 : isTablet ? 600 : 900,

            bgcolor: "background.paper",
            border: "none",
            borderRadius: 3,
            boxShadow: 24,
            textAlign: "center",
            p: 4,
            height: isMobile ? 500 : isTablet ? 500 : 600,
            overflow: "auto",
          }}
        >
          <div className="flex justify-between items-center">
            <p
              style={{
                fontWeight: 600,
                fontSize: 25,
                textAlign: "left",
                lineHeight: "26px",
              }}
              className="mb-1 jost-regular mr-4"
            >
              {" "}
              Edit Venue 12
            </p>
          </div>

          <div className="row pt-5 flex flex-col" style={{ gap: "30px 10px" }}>
            <div className="col-md-6">
              <TextField
                label="Name"
                error={inputDataError?.name}
                value={inputData?.name}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, name: e.target.value });
                  if (e.target.value?.length > 1) {
                    setInputDataError({ ...inputDataError, name: false });
                  } else {
                    setInputDataError({ ...inputDataError, name: true });
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Address"
                error={inputDataError?.address}
                value={inputData?.address}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, address: e.target.value });
                  if (e.target.value?.length > 1) {
                    setInputDataError({ ...inputDataError, address: false });
                  } else {
                    setInputDataError({ ...inputDataError, address: true });
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Address Url"
                error={inputDataError?.addressUrl}
                value={inputData?.addressUrl}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, addressUrl: e.target.value });
                  if (e.target.value?.length > 1) {
                    setInputDataError({ ...inputDataError, addressUrl: false });
                  } else {
                    setInputDataError({ ...inputDataError, addressUrl: true });
                  }
                }}
              />
            </div>
            {/* <div className="col-md-6">
              <FormControl size="small" fullWidth>
                <FormControl sx={{ m: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Amenities
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={inputData?.amenities.map(
                      (amenity) => amenity.amenitiesId
                    )}
                    onChange={(e) => {
                      const selectedIds = e.target.value;
                      const selectedAmenities = allAmenities.filter((amenity) =>
                        selectedIds.includes(amenity.amenitiesId)
                      );
                      setInputData({
                        ...inputData,
                        amenities: selectedAmenities,
                      });
                    }}
                    input={<OutlinedInput label="Amenities" />}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (id) =>
                            allAmenities.find(
                              (amenity) => amenity.amenitiesId === id
                            )?.name
                        )
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                  >
                    {allAmenities.map((item) => (
                      <MenuItem key={item.amenitiesId} value={item.amenitiesId}>
                        <Checkbox
                          checked={inputData?.amenities.some(
                            (amenity) =>
                              amenity.amenitiesId === item.amenitiesId
                          )}
                        />
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormControl>
            </div> */}
            <div className="col-md-6">
              <TextField
                label="Description"
                error={inputDataError?.description}
                value={inputData?.description}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, description: e.target.value });
                  if (e.target.value?.length > 1) {
                    setInputDataError({
                      ...inputDataError,
                      description: false,
                    });
                  } else {
                    setInputDataError({ ...inputDataError, description: true });
                  }
                }}
              />
            </div>
            <div className="col-md-12">
              <TextField
                label="Cancellation Policy"
                error={inputDataError?.cancellationPolicy}
                value={inputData?.cancellationPolicy}
                fullWidth
                onChange={(e) => {
                  setInputData({
                    ...inputData,
                    cancellationPolicy: e.target.value,
                  });
                  if (e.target.value?.length > 1) {
                    setInputDataError({
                      ...inputDataError,
                      cancellationPolicy: false,
                    });
                  } else {
                    setInputDataError({
                      ...inputDataError,
                      cancellationPolicy: true,
                    });
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Owner Name"
                error={inputDataError?.ownerName}
                value={inputData?.ownerName}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, ownerName: e.target.value });
                  if (e.target.value?.length > 1) {
                    setInputDataError({ ...inputDataError, ownerName: false });
                  } else {
                    setInputDataError({ ...inputDataError, ownerName: true });
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Email"
                error={inputDataError?.email}
                value={inputData?.email}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, email: e.target.value });
                  if (e.target.value?.length > 1) {
                    setInputDataError({ ...inputDataError, email: false });
                  } else {
                    setInputDataError({ ...inputDataError, email: true });
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Phone Number"
                type="number"
                error={inputDataError?.phoneNo}
                value={inputData?.phoneNo}
                fullWidth
                disabled
                onChange={(e) => {
                  setInputData({ ...inputData, phoneNo: e.target.value });
                  if (e.target.value?.length === 10) {
                    setInputDataError({ ...inputDataError, phoneNo: false });
                  } else {
                    setInputDataError({ ...inputDataError, phoneNo: true });
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Alternative Phone Number"
                type="number"
                error={inputDataError?.alternativePhoneNo}
                value={inputData?.alternativePhoneNo}
                fullWidth
                onChange={(e) => {
                  setInputData({
                    ...inputData,
                    alternativePhoneNo: e.target.value,
                  });
                  if (e.target.value?.length === 10) {
                    setInputDataError({
                      ...inputDataError,
                      alternativePhoneNo: false,
                    });
                  } else {
                    setInputDataError({
                      ...inputDataError,
                      alternativePhoneNo: true,
                    });
                  }
                }}
              />
            </div>
            {user?.role === "admin" && (
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <div className="col-md-6">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Preamount
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={inputData.preamount}
                        label="Sport"
                        fullWidth
                        sx={{ width: 200 }}
                        onChange={(e) => {
                          setInputData({
                            ...inputData,
                            preamount: e.target.value,
                          });
                          if (e.target.value?.length > 1) {
                            setInputDataError({
                              ...inputDataError,
                              preamount: false,
                            });
                          } else {
                            setInputDataError({
                              ...inputDataError,
                              preamount: true,
                            });
                          }
                        }}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={75}>75</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className="col-md-6">
                    <FormControl fullWidth>
                      <TextField
                        label="Position"
                        type="number"
                        error={inputDataError?.position}
                        value={inputData?.position}
                        fullWidth
                        onChange={(e) => {
                          setInputData({
                            ...inputData,
                            position: e.target.value,
                          });
                          if (e.target.value?.length > 1) {
                            setInputDataError({
                              ...inputDataError,
                              position: false,
                            });
                          } else {
                            setInputDataError({
                              ...inputDataError,
                              position: true,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            )}
            <div className="col-md-6">
              <TextField
                label="Max Days"
                type="number"
                error={inputDataError?.maxdays}
                value={inputData?.maxdays}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, maxdays: e.target.value });
                  if (e.target.value?.length > 1) {
                    setInputDataError({ ...inputDataError, maxdays: false });
                  } else {
                    setInputDataError({ ...inputDataError, maxdays: true });
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Password"
                type="text"
                value={inputData?.password}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, password: e.target.value });
                }}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Staff Password"
                type="text"
                value={inputData?.staffPassword}
                fullWidth
                onChange={(e) => {
                  setInputData({ ...inputData, staffPassword: e.target.value });
                }}
              />
            </div>

            {user?.role === "admin" && (
              <div className="col-md-6">
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={inputData?.isBookable}
                      onChange={(e) => {
                        setInputData({
                          ...inputData,
                          isBookable: e.target.checked,
                        });
                      }}
                    />
                  }
                  label={"Is Bookable ?"}
                  labelPlacement="start"
                  sx={{ justifyContent: "flex-end", display: "flex" }}
                />
              </div>
            )}

            {user?.role === "admin" && (
              <div className="col-md-6">
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={inputData?.isFeatured}
                      onChange={(e) => {
                        setInputData({
                          ...inputData,
                          isFeatured: e.target.checked,
                        });
                      }}
                    />
                  }
                  label={"Is Featured ?"}
                  labelPlacement="start"
                  sx={{ justifyContent: "flex-end", display: "flex" }}
                />
              </div>
            )}

            {inputData?.whatsappMobileNo?.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 10,
                  width: "100%",
                }}
              >
                <div className="col-md-6">
                  <TextField
                    label="Whatsapp Number"
                    type="number"
                    value={item}
                    style={{ width: "100%" }}
                    fullWidth
                    onChange={(e) => {
                      let arr = [...inputData?.whatsappMobileNo];
                      arr[i] = e.target.value;
                      setInputData({ ...inputData, whatsappMobileNo: arr });
                    }}
                  />
                </div>

                <div
                  style={{
                    background: "black",
                    padding: 12,
                    borderRadius: 6,
                  }}
                  onClick={() => {
                    let arr = [...inputData?.whatsappMobileNo];
                    arr?.push("");
                    setInputData({ ...inputData, whatsappMobileNo: arr });
                  }}
                >
                  <Plus size={30} className="cursor-pointer text-white" />
                </div>
                <div
                  style={{
                    background: "black",
                    padding: 12,
                    borderRadius: 6,
                  }}
                  onClick={() => {
                    let arr = [...inputData?.whatsappMobileNo];
                    arr?.splice(i, 1);
                    setInputData({ ...inputData, whatsappMobileNo: arr });
                  }}
                >
                  <Trash2 size={30} className="cursor-pointer text-white" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end gap-3 mr-5 ml-5 ">
            <button
              onClick={(e) => {
                setOpen(false);
              }}
              className="bg-black text-white  "
              style={{ borderRadius: 8, padding: "5px 25px" }}
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
              className="bg-black text-white p-3 "
              style={{ borderRadius: 8 }}
            >
              Save Changes
            </button>
          </div>
        </Box>
      )}
    </Modal>
  );
};

export default EditVenue;
