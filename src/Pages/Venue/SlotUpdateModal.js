import React, { useCallback, useEffect, useState } from "react";
import { getAllSlotByVenueCourtId, updateSlots } from "../../Libs/api";
// import moment from "moment";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import { toast } from "react-toastify";
import Loader from "../../Component/Loader";
import {
  Box,
  Modal,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  TextField,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { Plus, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import moment from "moment-timezone";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import useBreakPoints from "../../hooks/useBreakPoints";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Row, Col } from "reactstrap";
dayjs.extend(utc);
dayjs.extend(timezone);

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

const DaysArr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SlotUpdateModal = ({
  open,
  setOpen,
  handleCallBackApi,
  location,
  selectedCourt,
  selectedSport,
  selectedDay,
}) => {
  const { isMobile, isTablet } = useBreakPoints();
  console.log("selectedDay: ", selectedDay);
  console.log({ location, selectedCourt, selectedSport });
  const [loading, setloading] = useState(false);
  const [hourState, setHourState] = useState(false);
  console.log("hourState: ", hourState);
  const [timeSlots, setTimeSlots] = useState([
    {
      from: "",
      to: "",
      amount: "",
    },
  ]);
  console.log("timeSlots: ", timeSlots);
  const [dateRange, setDateRange] = useState([null, null]);
  const [specificDates, setSpecificDates] = useState([]);
  console.log("specificDates: ", specificDates);

  const [serverTimezone, setServerTimezone] = useState("UTC");

  const getServerTimezone = () => {
    // This should be replaced with actual server timezone detection
    // For now, we'll use a placeholder method
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  useEffect(() => {
    const fetchServerTimezone = async () => {
      const tz = await getServerTimezone();
      setServerTimezone(tz);
    };
    fetchServerTimezone();
  }, [getServerTimezone]);

  const handleClose = useCallback(() => {
    // do something
    setTimeSlots([]);
    setOpen(false);

    // ensure there's no incorrect call to destroy
  }, [setOpen]);

  const shouldDisableTime = (value, view, fromTime) => {
    if (!fromTime) return false;

    const valueHour = value.hour();
    const fromHour = fromTime.hour();

    if (view === "hours") {
      // Always allow selection of 00:00 (representing 24:00) for the "to" field
      if (valueHour === 0) return false;

      // Disable hours before the "from" time
      return valueHour < fromHour;
    }

    if (view === "minutes") {
      if (valueHour === fromHour) {
        return value.minute() <= fromTime.minute();
      }
      // Allow all minutes if the hour is different (including 00:00)
      return false;
    }

    return false;
  };

  const formatTime = (time) => {
    if (!time) return "";
    // Check if the time is 00:00 and it's meant to represent 24:00
    if (
      time.hour() === 0 &&
      time.minute() === 0 &&
      time.date() !== moment().date()
    ) {
      return "24:00";
    }
    return time.format("HH:mm");
  };

  const handleChange = (name, value, i) => {
    let arr = [...timeSlots];
    const serverTimezone = getServerTimezone();

    if (name === "amount") {
      arr[i][name] = value;
    } else if (name === "from" || name === "to") {
      if (value) {
        // Convert the input value to a moment object in the server's time zone
        let timeInServerZone = moment.tz(
          value.format("YYYY-MM-DD HH:mm"),
          serverTimezone
        );

        // Round minutes to nearest 30
        const minutes = timeInServerZone.minute();
        const roundedMinutes = Math.round(minutes / 30) * 30;
        timeInServerZone = timeInServerZone.minute(roundedMinutes);

        // Special handling for 24:00 (00:00)
        if (
          name === "to" &&
          timeInServerZone.hour() === 0 &&
          timeInServerZone.minute() === 0
        ) {
          // Set to 24:00
          arr[i][name] = timeInServerZone.add(1, "day").startOf("day");
          arr[i][`${name}-value`] = "24:00";
        } else {
          arr[i][name] = timeInServerZone;
          arr[i][`${name}-value`] = timeInServerZone.format("HH:mm");
        }

        if (name === "from") {
          // Reset "to" when "from" is changed
          arr[i]["to"] = null;
          arr[i]["to-value"] = null;
        }
      } else {
        // Handle null value
        arr[i][name] = null;
        arr[i][`${name}-value`] = null;
      }
    }

    console.log("Updated timeSlots:", arr);
    setTimeSlots(arr);
  };
  const timeToISO = (timeStr) => {
    const today = new Date();
    const date = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the local time zone

    const dateTimeStr = `${date}T${timeStr}:00`;
    const localDate = new Date(dateTimeStr);

    // Adjust the time to the desired timezone
    const options = {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const parts = formatter.formatToParts(localDate);

    // Extract hour, minute, and second from the formatted parts
    const hours = parts
      .find((part) => part.type === "hour")
      .value.padStart(2, "0");
    const minutes = parts
      .find((part) => part.type === "minute")
      .value.padStart(2, "0");
    const seconds = parts
      .find((part) => part.type === "second")
      .value.padStart(2, "0");

    return new Date(`${date}T${hours}:${minutes}:${seconds}Z`).toISOString();
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setloading(true);
        let formData = {
          venueCourtId: selectedCourt,
          days: selectedDay,
        };
        const apiCall = await getAllSlotByVenueCourtId(formData);
        if (apiCall.status) {
          console.log(apiCall, "apiCall");

          const groupSlots = (apiData) => {
            const slotMap = new Map();

            apiData.forEach((slot) => {
              const { startTime, endTime, price, slotId } = slot;
              const amount = price.toFixed(2);
              console.log(
                'dayjs.tz(timeToISO(startTime), "UTC"): ',
                dayjs.tz(timeToISO(startTime))
              );
              const fromISO = dayjs.tz(timeToISO(startTime));
              console.log("fromISO: ", fromISO);
              const toISO = dayjs.tz(timeToISO(endTime));
              console.log("toISO: ", toISO);

              if (slotMap.has(amount)) {
                const existingSlot = slotMap.get(amount);
                existingSlot.from = dayjs(existingSlot.from).isBefore(fromISO)
                  ? existingSlot.from
                  : fromISO;
                existingSlot.to = dayjs(existingSlot.to).isAfter(toISO)
                  ? existingSlot.to
                  : toISO;
                existingSlot["from-value"] =
                  existingSlot["from-value"] < startTime
                    ? existingSlot["from-value"]
                    : startTime;
                existingSlot["to-value"] =
                  existingSlot["to-value"] > endTime
                    ? existingSlot["to-value"]
                    : endTime;
              } else {
                slotMap.set(amount, {
                  slotId,
                  from: fromISO,
                  to: toISO,
                  amount,
                  "from-value": startTime,
                  "to-value": endTime,
                });
              }
            });

            return Array.from(slotMap.values());
          };

          // Usage
          const result = groupSlots(apiCall.data);
          console.log("result: ", result);
          setTimeSlots(result || []);
          setHourState(apiCall?.data?.[0]?.slotDuration || false);
          console.log(
            "apiCall?.data?.[0]?.slotDuration: ",
            apiCall?.data?.[0]?.slotDuration
          );
          setloading(false);
        } else {
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    }, 100);

    return () => clearTimeout(timer); // Proper cleanup
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let error = false;
    console.log("timeSlots", timeSlots);

    // eslint-disable-next-line
    timeSlots?.map((er) => {
      // eslint-disable-next-line
      if (!er?.["from-value"]) {
        error = true;
        toast.error(`Please Select a From Time`);
      } else if (!er?.["to-value"]) {
        error = true;
        toast.error(`Please Select a To Time`);
      } else if (!er?.amount) {
        error = true;
        toast.error(`Please Enter a Amount`);
      }
    });

    if (!dateRange[0] || !dateRange[1]) {
      toast.error("Please Select a Date Range!");
    } else if (!error) {
      let formData = {
        slotData: JSON.stringify(timeSlots),
        slotDuration: hourState,
        venueCourtId: selectedCourt,
        specificDates: JSON.stringify(specificDates),
        days: selectedDay,
      };
      console.log("hourState: ", hourState);
      console.log("formData: ", formData);
      // return false;

      setloading(true);

      try {
        const apiCall = await updateSlots(formData);
        if (apiCall.status) {
          setTimeSlots([]);
          setTimeout(() => {
            console.log(apiCall, "apiCall");
            handleCallBackApi();
            setloading(false);
          }, 1000);
          // updateStep("step10")
          setOpen(false);
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
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const start = dayjs(dateRange[0]);
      const end = dayjs(dateRange[1]);
      const dates = [];
      const dayIndex = DaysArr.indexOf(selectedDay);

      if (dayIndex === -1) {
        console.error("Invalid day specified");
        return;
      }

      let current = start.clone();
      while (current.isBefore(end) || current.isSame(end, "day")) {
        if (current.day() === dayIndex) {
          dates.push(current.format("YYYY-MM-DD"));
        }
        current = current.add(1, "day");
      }

      setSpecificDates(dates);
    }
  }, [dateRange, selectedDay]);

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const isDateDisabled = (date) => {
    return date.isBefore(dayjs(), "day");
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
            width: isMobile ? 300 : isTablet ? 600 : 900,
            bgcolor: "background.paper",
            border: "none",
            borderRadius: 3,
            boxShadow: 24,
            textAlign: "center",
            height: isTablet ? "90%" : "auto",
            overflow: isTablet && "auto",
          }}
        >
          <div
            className={`flex justify-between items-center bg-blue-100 p-3 ${
              isMobile ? "flex-col gap-3 w-full" : ""
            }`}
          >
            <p
              style={{
                fontWeight: 600,
                fontSize: 16,
                textAlign: "left",
                lineHeight: "26px",
              }}
              className="mb-1 jost-regular mr-4"
            >
              {" "}
              {location?.name} ({" "}
              {
                location?.venueCourts?.find(
                  (er) => er?.venueCourtId === selectedCourt
                )?.courtName
              }{" "}
              ) - {selectedDay}
            </p>

            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ m: 1 }}
                  checked={timeSlots?.length <= 0 ? false : true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      let mainArr = [...timeSlots];

                      mainArr?.push({
                        from: "",
                        to: "",
                        amount: "",
                      });
                      setTimeSlots(mainArr);
                      console.log("true");
                    } else {
                      console.log("false");

                      setTimeSlots([]);
                    }
                  }}
                />
              }
              label={timeSlots?.length <= 0 ? "Add Slot" : "Remove Slot"}
              // labelPlacement="start"
              sx={{ width: isTablet ? "auto" : "15%", textWrap: "nowrap" }}
            />
          </div>

          <div className="mt-7 p-3 flex flex-col">
            <div
              className={`flex justify-between ${
                isMobile && "flex-col gap-3 w-full"
              }`}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DateRangePicker"]}
                  sx={{ width: isMobile ? "100%" : "50%" }}
                >
                  <DateRangePicker
                    localeText={{ start: "From Date", end: "To Date" }}
                    shouldDisableDate={isDateDisabled}
                    value={dateRange}
                    format="DD/MM/YYYY"
                    onChange={handleDateRangeChange}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <div className="flex justify-center items-center gap-3">
                <div
                  style={{
                    backgroundColor: "#EEF2F5",
                    padding: "5px 10px",
                    display: "flex",
                    gap: 10,
                    borderRadius: 8,
                  }}
                >
                  <span
                    onClick={() => {
                      setHourState(true);
                    }}
                    style={{
                      padding: 10,
                      cursor: "pointer",
                      backgroundColor: hourState ? "black" : "#EEF2F5",
                      color: hourState ? "white" : "black",
                      borderRadius: 8,
                    }}
                  >
                    Half Hour
                  </span>
                  <span
                    onClick={() => {
                      setHourState(false);
                    }}
                    style={{
                      padding: 10,
                      cursor: "pointer",
                      backgroundColor: !hourState ? "black" : "#EEF2F5",
                      color: !hourState ? "white" : "black",
                      borderRadius: 8,
                    }}
                  >
                    One Hour
                  </span>
                </div>
              </div>
            </div>
            {timeSlots?.length > 0 &&
              timeSlots?.map((item, i) => (
                <div
                  className={`mt-4 flex gap-2 ${
                    isTablet && "flex-col gap-3 w-full"
                  }`}
                >
                  <div>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="en"
                    >
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          label="From"
                          viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                          }}
                          value={item?.from || null}
                          format="HH:mm"
                          timezone={serverTimezone}
                          onChange={(e) => {
                            handleChange("from", e, i);
                          }}
                          views={hourState ? ["hours", "minutes"] : ["hours"]}
                          // shouldDisableTime={(value, view) =>
                          //   shouldDisableTime(value, view, item?.from)
                          // }

                          minutesStep={30}
                          slotProps={{
                            textField: {
                              error: false,
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  <div>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="en"
                    >
                      <DemoContainer
                        components={["TimePicker"]}
                        sx={{ minWidth: "auto" }}
                      >
                        <TimePicker
                          label="To"
                          viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                          }}
                          value={item?.to || null}
                          format="HH:mm"
                          timezone={serverTimezone}
                          onChange={(e) => {
                            handleChange("to", e, i);
                          }}
                          views={hourState ? ["hours", "minutes"] : ["hours"]}
                          shouldDisableTime={(value, view) =>
                            shouldDisableTime(value, view, item?.from)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={formatTime(item?.to)}
                            />
                          )}
                          minutesStep={30}
                          disabled={!item?.from}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  <div>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <InputLabel htmlFor="outlined-adornment-amount">
                        Amount
                      </InputLabel>
                      <OutlinedInput
                        type="number"
                        value={item?.amount}
                        onChange={(e) => {
                          handleChange("amount", e.target.value, i);
                        }}
                        id="outlined-adornment-amount"
                        startAdornment={
                          <InputAdornment position="start">₹</InputAdornment>
                        }
                        label="Amount"
                      />
                    </FormControl>
                  </div>

                  <div className="flex items-center gap-2 mx-4">
                    <div
                      style={{
                        background: "black",
                        padding: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Plus
                        size={30}
                        className="cursor-pointer text-white"
                        onClick={() => {
                          let mainArr = [...timeSlots];

                          mainArr?.push({
                            from: "",
                            to: "",
                            amount: "",
                          });
                          setTimeSlots(mainArr);
                        }}
                      />
                    </div>

                    {timeSlots?.length - 1 !== 0 && (
                      <div
                        style={{
                          background: "black",
                          padding: 5,
                          borderRadius: 6,
                        }}
                      >
                        <Trash2
                          style={{ fontSize: 12 }}
                          size={30}
                          className="cursor-pointer text-white"
                          onClick={() => {
                            let mainArr = [...timeSlots];

                            mainArr?.splice(i, 1);
                            setTimeSlots(mainArr);
                          }}
                        />{" "}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div
            className={` flex justify-end gap-3 mr-5 p-4  ${
              isMobile
                ? "flex-col gap-3 w-full mb-5"
                : isTablet
                ? "mb-5"
                : "ml-5 mt-10"
            } `}
          >
            <button
              onClick={(e) => {
                handleClose();
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
              className={`bg-black text-white ${isMobile ? "" : "p-3"} `}
              style={{ borderRadius: 8, padding: isMobile && "5px 25px" }}
            >
              Save Changes
            </button>
          </div>
        </Box>
      )}
    </Modal>
  );
};

export default SlotUpdateModal;
