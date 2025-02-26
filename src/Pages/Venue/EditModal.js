import {
  Box,
  FormControlLabel,
  FormGroup,
  Modal,
  Switch,
  TextField,
} from "@mui/material";
import moment from "moment";
import React, { useContext, useState } from "react";
import {
  storeBookingSlots,
  updateCancelBooking,
  updatePartialBookingSlots,
  updateSlotDetails,
} from "../../Libs/api";
import { toast } from "react-toastify";
import Loader from "../../Component/Loader";
import { Phone, User } from "lucide-react";
import { MyContext } from "../../hooks/MyContextProvider";
import Swal from "sweetalert2";

const EditModal = ({
  open,
  setOpen,
  selectedRow,
  handleCallBackApi,
  location,
  selectedCourt,
  selectedSport,
}) => {
  const { user } = useContext(MyContext);
  console.log(selectedRow, "selectedCourt: ", selectedCourt);
  console.log("selectedSport: ", selectedSport);
  const [loading, setloading] = useState(false);
  const [inputData, setInputData] = useState({
    price: selectedRow?.row?.price,
    isavailable: selectedRow?.row?.isavailable,
  });
  const [userinputData, setUserInputData] = useState({
    username: "",
    phoneNumber: "",
    amount: "",
  });
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [step, setStep] = useState("step1");
  console.log(inputData, "inputData");

  const handleSubmitEdit = async () => {
    if (!inputData?.price) {
      toast.error("Please Enter a Price");
    } else {
      setloading(true);
      let formData = {
        price: inputData?.price,
        isavailable: inputData?.isavailable,
      };
      try {
        const apiCall = await updateSlotDetails(
          formData,
          selectedRow?.row?.slotid
        );
        if (apiCall.status) {
          console.log(apiCall, "apiCall");

          setloading(false);
          setOpen(false);
          handleCallBackApi();
        } else {
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    }
  };

  const handleSubmitBooking = async () => {
    if (!userinputData?.username) {
      toast.error("Please Enter a Username");
    } else if (!userinputData?.phoneNumber) {
      toast.error("Please Enter a Phone Number");
      setPhoneNumberError(true);
    } else if (userinputData?.phoneNumber?.length !== 10) {
      toast.error("Please Enter a Valid Phone Number");
    } else {
      let formData = {
        venueid: location?.venueId,
        venuesportid: selectedSport?.sportid,
        bookings: [
          {
            venuecourtid: selectedCourt,
            slots: [
              {
                startTime: selectedRow?.row?.startTime,
                endTime: selectedRow?.row?.endTime,
              },
            ],
          },
        ],
        username: userinputData?.username,
        phonenumber: userinputData?.phoneNumber,
        ispartialpayment: false,
        date: selectedRow?.row?.date,
        groundAmount: selectedRow?.row?.price,
        playerAmount: 0,
      };

      setloading(true);

      try {
        const apiCall = await storeBookingSlots(formData);
        if (apiCall.status) {
          console.log(apiCall, "apiCall");

          setloading(false);
          setOpen(false);
          handleCallBackApi();
        } else {
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    }
  };

  const handleSubmitPartialBooking = async () => {
    if (!userinputData?.username) {
      toast.error("Please Enter a Username");
    } else if (!userinputData?.phoneNumber) {
      toast.error("Please Enter a Phone Number");
      setPhoneNumberError(true);
    } else if (userinputData?.phoneNumber?.length !== 10) {
      toast.error("Please Enter a Valid Phone Number");
    } else if (!userinputData?.amount?.length) {
      toast.error("Please Enter a Amount");
    } else {
      let formData = {
        venueid: location?.venueId,
        venuesportid: selectedSport?.sportid,
        bookings: [
          {
            venuecourtid: selectedCourt,
            slots: [
              {
                startTime: selectedRow?.row?.startTime,
                endTime: selectedRow?.row?.endTime,
              },
            ],
          },
        ],
        username: userinputData?.username,
        phonenumber: userinputData?.phoneNumber,
        ispartialpayment: true,
        date: selectedRow?.row?.date,
        groundAmount: +userinputData?.amount,
        playerAmount: 0,
      };

      setloading(true);

      try {
        const apiCall = await storeBookingSlots(formData);
        if (apiCall.status) {
          console.log(apiCall, "apiCall");

          setloading(false);
          setOpen(false);
          handleCallBackApi();
        } else {
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    }
  };
  const handleUpdatePartialBooking = async () => {
    if (!userinputData?.amount?.length) {
      toast.error("Please Enter a Amount");
    } else {
      let formData = {
        bookingVenueId: selectedRow?.row?.bookingvenueid,
        isPartialpayment: true,
        groundAmount: +userinputData?.amount,
      };

      setloading(true);

      try {
        const apiCall = await updatePartialBookingSlots(formData);
        if (apiCall.status) {
          console.log(apiCall, "apiCall");

          setloading(false);
          setOpen(false);
          handleCallBackApi();
        } else {
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    }
  };

  const handleUpdateFullBooking = async () => {
    let formData = {
      bookingVenueId: selectedRow?.row?.bookingvenueid,
      isPartialpayment: false,
      groundAmount: +selectedRow?.row?.pendingAmount,
    };

    setloading(true);

    try {
      const apiCall = await updatePartialBookingSlots(formData);
      if (apiCall.status) {
        console.log(apiCall, "apiCall");

        setloading(false);
        setOpen(false);
        handleCallBackApi();
      } else {
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleDelete = async () => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let arr = [];
        arr?.push(selectedRow?.row?.bookingvenueid);

        let formData = {
          bookingVenueId: JSON.stringify(arr),
          message: "Slot Cancel By Venue Admin",
        };

        setloading(true);

        try {
          const apiCall = await updateCancelBooking(formData);
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
    });
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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "none",
            borderRadius: 3,
            boxShadow: 24,
            textAlign: "center",
            p: 4,
          }}
        >
          <p
            style={{ fontWeight: 600, fontSize: 20 }}
            className="mb-1 jost-regular"
          >
            Date :{" "}
            {moment(selectedRow?.row?.date, "YYYY-MM-DD").format("DD-MM-YYYY")}
          </p>
          <p
            style={{ fontWeight: 600, fontSize: 20, marginBottom: 20 }}
            className=" jost-regular "
          >
            Time : {selectedRow?.row?.startTime} - {selectedRow?.row?.endTime}
          </p>
          {step === "step1" && (
            <>
              {!selectedRow?.row?.isBooked && user?.role !== "venueStaff" && (
                <button
                  onClick={() => {
                    setStep("step2");
                  }}
                  class="view-button"
                >
                  Edit
                </button>
              )}
              {selectedRow?.row?.isBooked && selectedRow?.available && (
                <button
                  onClick={() => {
                    setStep("step3");
                  }}
                  class="mt-3 view-button"
                >
                  Details
                </button>
              )}
              {!selectedRow?.row?.isBooked && selectedRow?.available && (
                <button
                  onClick={() => {
                    setStep("step4");
                  }}
                  class="mt-3 view-button"
                >
                  Book
                </button>
              )}
              {selectedRow?.row?.isBooked &&
                user?.role !== "venueStaff" &&
                selectedRow?.available && (
                  <button
                    onClick={() => {
                      handleDelete();
                    }}
                    class="mt-3 view-button"
                  >
                    Cancel Booking
                  </button>
                )}
              {!selectedRow?.row?.isBooked && selectedRow?.available && (
                <button
                  onClick={() => {
                    setStep("step5");
                  }}
                  class="mt-3 view-button"
                >
                  Partial Booking
                </button>
              )}
              {selectedRow?.row?.ispartialpayment && selectedRow?.available && (
                <button
                  onClick={() => {
                    handleUpdateFullBooking();
                  }}
                  class="mt-3 view-button"
                >
                  Full Booking
                </button>
              )}
              {selectedRow?.row?.ispartialpayment && selectedRow?.available && (
                <button
                  onClick={() => {
                    setStep("step6");
                  }}
                  class="mt-3 view-button"
                >
                  Partial Booking
                </button>
              )}
            </>
          )}

          {step === "step2" && (
            <>
              <TextField
                type="number"
                fullWidth
                id="outlined-controlled"
                label={`Price`}
                className="mt-4"
                value={inputData.price}
                onChange={(event) => {
                  setInputData({ ...inputData, price: event.target.value });
                }}
              />

              <FormGroup>
                <FormControlLabel
                  labelPlacement="start"
                  className="justify-end m-0 mt-2"
                  control={
                    <Switch
                      size="medium"
                      checked={inputData?.isavailable}
                      onChange={(e) => {
                        setInputData({
                          ...inputData,
                          isavailable: e.target.checked,
                        });
                      }}
                    />
                  }
                  label="Is Available"
                />
              </FormGroup>

              <div className="flex gap-4 justify-center items-center mt-2">
                <button
                  onClick={() => {
                    handleSubmitEdit();
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setStep("step1");
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {step === "step3" && (
            <div className="pb-2">
              <hr
                style={{
                  height: 3,
                  width: "100%",
                  left: 0,
                  position: "absolute",
                }}
              />
              <p
                className="pt-4 flex justify-start items-center gap-2 font-extrabold"
                style={{ fontSize: 20 }}
              >
                <User size={25} className="mx-2" /> {selectedRow?.row?.userName}
              </p>
              <p
                className="flex justify-start items-center gap-2 font-extrabold mt-2"
                style={{ fontSize: 20 }}
              >
                <Phone size={25} className="mx-2" />
                {selectedRow?.row?.phoneNumber}
              </p>
              {selectedRow?.row?.pendingAmount ? (
                <p
                  className="flex justify-start items-center gap-2 font-extrabold mt-2"
                  style={{ fontSize: 20 }}
                >
                  Pending Amount : &nbsp;
                  {selectedRow?.row?.pendingAmount}
                </p>
              ) : (
                ""
              )}

              <button
                onClick={() => {
                  setOpen(false);
                }}
                style={{ width: "100%" }}
                class="view-button mt-4"
              >
                Close
              </button>
            </div>
          )}

          {step === "step4" && (
            <>
              <TextField
                type="text"
                fullWidth
                id="outlined-controlled"
                label={`Username`}
                className="mt-4"
                value={userinputData.username}
                onChange={(event) => {
                  setUserInputData({
                    ...userinputData,
                    username: event.target.value,
                  });
                }}
              />
              <TextField
                type="number"
                fullWidth
                id="outlined-controlled"
                label={`Phone Number`}
                className="mt-4"
                sx={{ marginTop: 2 }}
                error={phoneNumberError}
                value={userinputData.phoneNumber}
                onChange={(event) => {
                  setUserInputData({
                    ...userinputData,
                    phoneNumber: event.target.value,
                  });
                  if (event.target.value.length === 10) {
                    setPhoneNumberError(false);
                  } else {
                    setPhoneNumberError(true);
                  }
                }}
              />

              <div className="flex gap-4 justify-center items-center mt-3">
                <button
                  onClick={() => {
                    handleSubmitBooking();
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setStep("step1");
                    setUserInputData({ username: "", phoneNumber: "" });
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {step === "step5" && (
            <>
              <hr
                style={{
                  height: 3,
                  width: "100%",
                  left: 0,
                  position: "absolute",
                }}
              />

              <TextField
                type="text"
                fullWidth
                id="outlined-controlled"
                label={`Username`}
                className="mt-4"
                sx={{ marginTop: 3 }}
                value={userinputData.username}
                onChange={(event) => {
                  setUserInputData({
                    ...userinputData,
                    username: event.target.value,
                  });
                }}
              />
              <TextField
                type="number"
                fullWidth
                id="outlined-controlled"
                label={`Phone Number`}
                sx={{ marginTop: 2 }}
                error={phoneNumberError}
                className="mt-4"
                value={userinputData.phoneNumber}
                onChange={(event) => {
                  setUserInputData({
                    ...userinputData,
                    phoneNumber: event.target.value,
                  });
                  if (event.target.value.length === 10) {
                    setPhoneNumberError(false);
                  } else {
                    setPhoneNumberError(true);
                  }
                }}
              />
              <TextField
                type="number"
                fullWidth
                id="outlined-controlled"
                label={`amount`}
                className="mt-4"
                sx={{ marginTop: 2 }}
                value={userinputData.amount}
                onChange={(event) => {
                  if (event.target.value <= +selectedRow?.row?.price) {
                    setUserInputData({
                      ...userinputData,
                      amount: event.target.value,
                    });
                  } else {
                    toast.error("Amount is Greater than Slot Price", {
                      toastId: "greaterId",
                    });
                  }
                }}
              />

              <div className="flex gap-4 justify-center items-center mt-4">
                <button
                  onClick={() => {
                    handleSubmitPartialBooking();
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setStep("step1");
                    setUserInputData({ username: "", phoneNumber: "" });
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Close
                </button>
              </div>
            </>
          )}
          {step === "step6" && (
            <>
              <hr
                style={{
                  height: 3,
                  width: "100%",
                  left: 0,
                  position: "absolute",
                }}
              />

              <TextField
                type="number"
                fullWidth
                id="outlined-controlled"
                sx={{ marginTop: 2 }}
                label={`amount`}
                className="mt-4"
                value={userinputData.amount}
                onChange={(event) => {
                  if (event.target.value <= +selectedRow?.row?.pendingAmount) {
                    setUserInputData({
                      ...userinputData,
                      amount: event.target.value,
                    });
                  } else {
                    toast.error("Amount is Greater than Pending Amount", {
                      toastId: "greaterId",
                    });
                  }
                }}
              />

              <div className="flex gap-4 justify-center items-center mt-2">
                <button
                  onClick={() => {
                    handleUpdatePartialBooking();
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setStep("step1");
                    setUserInputData({ username: "", phoneNumber: "" });
                  }}
                  style={{ width: "55%" }}
                  class="view-button mt-4"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </Box>
      )}
    </Modal>
  );
};

export default EditModal;
