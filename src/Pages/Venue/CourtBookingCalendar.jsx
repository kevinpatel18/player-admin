import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isToday,
  parse,
  isBefore,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  PencilRuler,
  Settings2,
} from "lucide-react";
import { Button, Table } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Loader from "../../Component/Loader";
import {
  getAllBookingSlots,
  getAllVenue,
  getLocationDetails,
} from "../../Libs/api";
import { toast } from "react-toastify";
import moment from "moment";
import MaskGroup from "../../assets/Images/Mask-group.png";
import EditModal from "./EditModal";
import { MyContext } from "../../hooks/MyContextProvider";
import RecordNotFoundImage from "../../assets/Images/Record-Not-Found.png";
// import SlotUpdateModal from "./SlotUpdateModal";
// import EditVenueModal from "./EditVenueModal";
import useBreakPoints from "../../hooks/useBreakPoints";
import SlotUpdateModal from "./SlotUpdateModal";

export default function CourtBookingCalendar() {
  const navigate = useNavigate();
  const {
    user,
    selectedVenue,
    updateSelectedVenue,
    selectedCourt,
    updateSelectedCourt,
    selectedSport,
    updateSelectedSport,
    setIsCollapsed,
    setOpenMenu,
    isCollapsed,
    openMenu,
    counter,
    updateCounter,
  } = useContext(MyContext);
  console.log("selectedVenue: ", selectedVenue);

  const [wsConnected, setWsConnected] = useState(false);
  const { isTablet, isMobile } = useBreakPoints();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const location = useLocation();
  const [allVenue, setAllVenue] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  console.log("currentDate: ", currentDate);
  const [allBookingDetails, setAllBookingDetails] = useState([]);
  const [loading, setloading] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [timingModal, setTimingModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const startDate = startOfWeek(currentDate);
  const endDate = addDays(startDate, 6);
  console.log("counter: ", counter);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    const socket = new WebSocket(
      // "ws://localhost:80"
      "wss://pllayer-backend.onrender.com"
    );
    // const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWsConnected(true);
      wsRef.current = socket;

      // If there's a pending reconnection timeout, clear it
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "allBookingSlotResult") {
        if (response.status) {
          setAllBookingDetails(response.data);
          let arr1 = response?.data?.bookingSlots?.map(
            (slot) => slot.startTime
          );
          const uniqueArr = [...new Set(arr1)];
          const filteredUniqueArr = uniqueArr.filter((time) => time);

          setTimeSlots(
            filteredUniqueArr.sort((a, b) => {
              if (a === null) return 1;
              if (b === null) return -1;
              const [hoursA, minutesA] = a.split(":").map(Number);
              const [hoursB, minutesB] = b.split(":").map(Number);
              return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
            })
          );
        } else {
          console.error("Error:", response.message);
        }
      }
      if (response.type === "reloadPage") {
        console.log("Reload page event received");
        console.log("currentDate:2 ", currentDate);
        console.log("startDate:2 ", startDate);
        console.log("counter:2 ", localStorage.getItem("counter"));
        updateCounter(+localStorage.getItem("counter") + 1);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setWsConnected(false);
      wsRef.current = null;

      // Attempt to reconnect after a delay
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Attempting to reconnect...");
        connectWebSocket();
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close();
    };

    return socket;
  }, [counter]);

  // Separate function to get booking data
  const fetchUpdatedBookingData = useCallback(() => {
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);
    const formData = {
      venueId: JSON.parse(localStorage.getItem("selectedVenue") || "{}")
        ?.venueId,
      venueCourtId: localStorage.getItem("selectedCourt"),
      sportId: JSON.parse(localStorage.getItem("selectedSport") || "{}")
        ?.sportid,
      fromDate: moment(startDate).format("YYYY-MM-DD"),
      toDate: moment(endDate).format("YYYY-MM-DD"),
      type: "getAllBookingSlot",
      admin: true,
    };
    console.log("formData: @@@@@@@@@@@@@@@@@@@@@", formData);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(formData));
    } else {
      console.error("WebSocket not connected when trying to fetch data");
    }
  }, [startDate]);

  const sendWebSocketMessage = useCallback(
    (type, data) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.log("WebSocket not connected, attempting to reconnect...");
        connectWebSocket();
        // Queue the message to be sent after connection
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type, ...data }));
          } else {
            console.error("Failed to send message: WebSocket not connected");
          }
        }, 1000);
        return;
      }

      wsRef.current.send(JSON.stringify({ type, ...data }));
    },
    [connectWebSocket]
  );

  const getAllBookingSlotsWebSocket = useCallback(
    (params) => {
      sendWebSocketMessage("getAllBookingSlot", params);
    },
    [sendWebSocketMessage]
  );

  useEffect(() => {
    if (selectedVenue) {
      const socket = connectWebSocket();
      return () => {
        if (socket) {
          socket.close();
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };
    }
  }, [connectWebSocket, selectedVenue]);

  const getAllLocation = useCallback(async () => {
    try {
      const apiCall = await getLocationDetails();
      if (apiCall.status) {
        let arr = apiCall.data?.map((er) => ({
          ...er,
          locationId: er?.locationid,
        }));
        setLocationList(arr);

        setSelectedCity(arr?.[0]?.name);
        callAPI(arr?.[0]?.name);
      } else {
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, []);

  const callAPI = useCallback(async (locationName) => {
    try {
      let query = { location: locationName || "" };
      if (user?.role !== "admin") {
        query.userid = user?.userid;
      }

      const apiCall = await getAllVenue(query);
      if (apiCall.status) {
        // setAllVenue(apiCall.data);

        setAllVenue(apiCall?.data);

        if (apiCall?.data?.length > 0) {
          console.log(
            "apiCall?.data?.[0]?.sports?.[0]?.courts: ",
            apiCall?.data?.[0]?.sports?.[0]?.courts
          );
          updateSelectedVenue(apiCall?.data?.[0]);
          updateSelectedCourt(
            apiCall?.data?.[0]?.sports?.[0]?.courts?.[0]?.venuecourtid
          );
          updateSelectedSport(apiCall?.data?.[0]?.sports?.[0]);
        }

        setloading(false);
      } else {
        setloading(false);

        toast.error(apiCall?.message);
      }
    } catch (error) {
      setloading(false);

      console.log(error);
      toast.error(error);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      getAllLocation();
    } else {
      callAPI("");
    }
    // eslint-disable-next-line
  }, []);

  // Effect to detect route changes and disconnect WebSocket
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Close WebSocket when route changes
        console.log("WebSocket disconnected due to route change");
      }
    };
  }, [location?.pathname]);

  useEffect(() => {
    if (selectedVenue?.venueId) {
      console.log("selectedVenue?.venueId: ", selectedVenue?.venueId);
      let formData = {
        venueId: selectedVenue?.venueId,
        venueCourtId: selectedCourt,
        sportId: selectedSport?.sportid,
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
        admin: true,
      };
      console.log("formData: ", formData);
      // setloading(true);
      getAllBookingSlotsWebSocket(formData);
    }
    // eslint-disable-next-line
  }, [selectedVenue, selectedCourt, selectedSport, currentDate, counter]);

  const handleOpenModal = (timeSlots, dayIndex, row, pastTime) => {
    // if (row?.isavailable) {
    setOpenModal(true);
    setSelectedRow({
      timeSlots,
      dayIndex,
      row,
      pastTime,
      available: row?.isavailable,
    });
    // }
  };

  const handleCallBackApi = () => {
    // callAPI();
    let formData = {
      venueId: selectedVenue?.venueId,
      venueCourtId: selectedCourt,
      sportId: selectedSport?.sportid,
      fromDate: moment(startDate).format("YYYY-MM-DD"),
      toDate: moment(endDate).format("YYYY-MM-DD"),
      admin: true,
    };
    getAllBookingSlotsWebSocket(formData);
    // setloading(true);
    // allBookingCallAPI(formData);
  };

  const handleCallBackVenueApi = async () => {
    // callAPI();
    // let formData = {
    //   venueId: selectedVenue?.venueId,
    //   venueCourtId: selectedCourt,
    //   sportId: selectedSport?.sportid,
    //   fromDate: moment(startDate).format("YYYY-MM-DD"),
    //   toDate: moment(endDate).format("YYYY-MM-DD"),
    // };
    // setloading(true);
    // allBookingCallAPI(formData);

    try {
      let query = { location: selectedCity || "" };
      if (user?.role !== "admin") {
        query.userid = user?.userid;
      }

      const apiCall = await getAllVenue(query);
      if (apiCall.status) {
        // setAllVenue(apiCall.data);

        setAllVenue(apiCall?.data);

        setloading(false);
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

  const handleEditSlotTiming = (day) => {
    setTimingModal(true);
    setSelectedDay(day);
  };

  const updateLocation = async (value) => {
    setSelectedCity(value);
    try {
      let query = { location: value };
      if (user?.role !== "admin") {
        query.userid = user?.userid;
      }

      const apiCall = await getAllVenue(query);
      if (apiCall.status) {
        // setAllVenue(apiCall.data);

        setAllVenue(apiCall?.data);

        if (apiCall?.data?.length > 0) {
          console.log(
            "apiCall?.data?.[0]?.sports?.[0]?.courts: ",
            apiCall?.data?.[0]?.sports?.[0]?.courts
          );
          updateSelectedVenue(apiCall?.data?.[0]);
          updateSelectedCourt(
            apiCall?.data?.[0]?.sports?.[0]?.courts?.[0]?.venuecourtid
          );
          updateSelectedSport(apiCall?.data?.[0]?.sports?.[0]);
        }

        setloading(false);
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

  const DrawerList = (
    <Box
      sx={{ width: 238 }}
      role="presentation"
      // onClick={() => setDrawerOpen(false)}
    >
      <h1
        className="p-4 text-start"
        style={{
          fontSize: 20,
          background: "black",
          color: "white",
          fontWeight: 800,
        }}
      >
        Apply Filter
      </h1>
      <div
        className={`flex justify-start flex-col gap-5 items-center mb-4  ${
          isMobile ? "flex-column gap-3" : ""
        }`}
      >
        <div className="flex items-center space-x-2 bg-white rounded-md px-2 py-3 border-1 border-slate-300 mt-6">
          <ChevronLeft
            className="w-5 h-5 text-gray-500 cursor-pointer"
            onClick={handlePrevWeek}
          />
          <span className="text-sm font-medium">
            {format(startDate, "d MMM")} - {format(endDate, "d MMM yyyy")}
          </span>
          <ChevronRight
            className="w-5 h-5 text-gray-500 cursor-pointer"
            onClick={handleNextWeek}
          />
        </div>

        {user?.role === "admin" && (
          <FormControl size="small" className="w-[200px] bg-white">
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={selectedCity}
              label="Location"
              onChange={(e) => updateLocation(e.target.value)}
            >
              {locationList?.map((item, i) => (
                <MenuItem value={item?.name} key={i}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl size="small" className="w-[200px]">
          <InputLabel id="venue-select-label">Venue</InputLabel>
          <Select
            labelId="venue-select-label"
            id="venue-select"
            value={selectedVenue}
            label="Venue"
            onChange={(e) => {
              updateSelectedVenue(e.target.value);
              updateSelectedCourt(
                e.target.value?.sports?.[0]?.courts?.[0]?.venuecourtid
              );
              updateSelectedSport(e.target.value?.sports?.[0]);
            }}
          >
            {allVenue?.map((item, i) => (
              <MenuItem value={item} key={i}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className="w-[200px]">
          <InputLabel id="sport-select-label">Sport</InputLabel>
          <Select
            labelId="sport-select-label"
            id="sport-select"
            value={selectedSport}
            label="Sport"
            onChange={(e) => {
              updateSelectedSport(e.target.value);
              updateSelectedCourt(e.target.value?.courts?.[0]?.venuecourtid);
            }}
          >
            {selectedVenue?.sports?.map((item, i) => (
              <MenuItem value={item} key={i}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Box>
  );

  if (loading) {
    return <Loader />;
  }
  return (
    <div style={{ width: "100%" }}>
      {allVenue?.length === 0 ? (
        <>
          <div className="flex flex-col w-full">
            {/* No Records Found Section */}
            <div className="flex flex-col items-center justify-center p-4 md:p-10 w-full">
              <img
                src={RecordNotFoundImage}
                className="h-48 w-64 md:h-64 md:w-80 object-contain"
                alt="No records found"
              />
              <p className="text-lg md:text-2xl font-semibold text-[#012e53] mt-3 text-center">
                No Record Found. Click on Add venue button to add venue.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 ">
            {/* Filter */}
            {!isTablet && (
              <div
                className={`flex justify-start gap-5 items-center mb-4  ${
                  isMobile ? "flex-column gap-3" : ""
                }`}
              >
                <div className="flex items-center space-x-2 bg-white rounded-md px-4 py-3 border-1 border-slate-300 ">
                  <ChevronLeft
                    className="w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={handlePrevWeek}
                  />
                  <span className="text-sm font-medium">
                    {format(startDate, "d MMM")} -{" "}
                    {format(endDate, "d MMM yyyy")}
                  </span>
                  <ChevronRight
                    className="w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={handleNextWeek}
                  />
                </div>

                {user?.role === "admin" && (
                  <FormControl size="small" className="w-[200px] bg-white">
                    <InputLabel id="location-select-label">Location</InputLabel>
                    <Select
                      labelId="location-select-label"
                      id="location-select"
                      value={selectedCity}
                      label="Location"
                      onChange={(e) => updateLocation(e.target.value)}
                    >
                      {locationList?.map((item, i) => (
                        <MenuItem value={item?.name} key={i}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <FormControl size="small" className="w-[200px]">
                  <InputLabel id="venue-select-label">Venue</InputLabel>
                  <Select
                    labelId="venue-select-label"
                    id="venue-select"
                    value={selectedVenue}
                    label="Venue"
                    onChange={(e) => {
                      updateSelectedVenue(e.target.value);
                      updateSelectedCourt(
                        e.target.value?.sports?.[0]?.courts?.[0]?.venuecourtid
                      );
                      updateSelectedSport(e.target.value?.sports?.[0]);
                    }}
                  >
                    {allVenue?.map((item, i) => (
                      <MenuItem value={item} key={i}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" className="w-[200px]">
                  <InputLabel id="sport-select-label">Sport</InputLabel>
                  <Select
                    labelId="sport-select-label"
                    id="sport-select"
                    value={selectedSport}
                    label="Sport"
                    onChange={(e) => {
                      updateSelectedSport(e.target.value);
                      updateSelectedCourt(
                        e.target.value?.courts?.[0]?.venuecourtid
                      );
                    }}
                  >
                    {selectedVenue?.sports?.map((item, i) => (
                      <MenuItem value={item} key={i}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {isTablet && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDrawerOpen(true);
                  }}
                  style={{ padding: "10px 23px" }}
                  className="bg-black text-white hover:bg-gray-800 flex items-center mb-3 rounded "
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Apply Filter
                </Button>
              </div>
            )}

            <div
              className="border-1 border-slate-300 border-bottom-none bg-white"
              style={{ borderRadius: "8px 8px 0px 0px" }}
            >
              <Box
                sx={{
                  flexGrow: 1,

                  borderRadius: "8px 8px 0px 0px",
                  paddingLeft: 2,
                }}
              >
                <Tabs
                  value={selectedCourt}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    updateSelectedCourt(newValue);
                  }}
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="scrollable force tabs example"
                >
                  {selectedSport?.courts?.map((court, i) => (
                    <Tab
                      label={court?.courtname}
                      value={court?.venuecourtid}
                      key={i}
                    />
                  ))}
                </Tabs>
              </Box>
            </div>

            <div
              className="cal-table table-responsive"
              style={{ maxHeight: "calc( 100vh - 230px)" }}
            >
              {" "}
              <Table
                id="table-calendar"
                className=" rounded-lg  w-full custom-table  p-4"
              >
                <thead className="sticky " style={{ top: 0 }}>
                  <tr className="bg-white">
                    <th
                      className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-10 border-1 border-slate-300"
                      style={{
                        backgroundColor: "#ffffff",
                        zIndex: 999,
                        width: 100,
                      }}
                    >
                      Time
                    </th>
                    {[...Array(7)].map((_, index) => {
                      const date = addDays(startDate, index);

                      const isCurrentDate = isToday(date); // check if the date is today

                      return (
                        <th
                          key={index}
                          style={{
                            borderTop: isCurrentDate && "2px solid #0044CA",
                            backgroundColor: isCurrentDate ? "white" : "",
                            minWidth: 100,
                          }}
                          className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-1 border-slate-300"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: 16,
                                  color: "black",
                                }}
                              >
                                {format(date, "dd")}
                              </div>
                              <div>{format(date, "EE").toUpperCase()}</div>
                            </div>
                            <div
                              style={{
                                background: "black",
                                padding: 5,
                                borderRadius: 6,
                              }}
                            >
                              <Settings2
                                onClick={() => {
                                  handleEditSlotTiming(format(date, "EEEE"));
                                }}
                                className="cursor-pointer text-white"
                                size={18}
                              />
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots?.length <= 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex flex-col items-center justify-center p-4 md:p-10 w-full">
                          <img
                            src={RecordNotFoundImage}
                            className="h-48 w-64 md:h-64 md:w-80 object-contain"
                            alt="No records found"
                          />
                          <p className="text-lg md:text-2xl font-semibold text-[#012e53] mt-3 text-center">
                            No Time Slots Found.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    timeSlots.map((slot, slotIndex) => (
                      <tr
                        key={slot}
                        className={`border-1 border-slate-300 ${
                          slotIndex % 2 === 0 ? "bg-white" : "bg-white"
                        }`}
                      >
                        <td
                          className="py-2 px-3  text-sm text-gray-500 sticky left-0 z-10 border-r-1 border-slate-300"
                          style={{
                            backgroundColor: "white",
                            zIndex: 999,
                            width: 100,
                            minWidth: 100,
                          }}
                        >
                          {slot}
                        </td>
                        {[...Array(7)].map((_, dayIndex) => {
                          console.log(slot, "sad", dayIndex);

                          const date = addDays(startDate, dayIndex);

                          const slotDateTime = parse(
                            `${format(date, "yyyy-MM-dd")} ${slot}`,
                            "yyyy-MM-dd HH:mm",
                            new Date()
                          );

                          const isPastTimeSlot = isBefore(
                            slotDateTime,
                            new Date()
                          );

                          const isBooked =
                            allBookingDetails?.bookingSlots?.find((booking) => {
                              if (
                                booking.date === format(date, "yyyy-MM-dd") &&
                                booking.startTime === slot
                              ) {
                                return booking;
                              } else {
                                return false;
                              }
                            });

                          console.log(isBooked);
                          return (
                            <td
                              style={{
                                minWidth: 200,

                                cursor: !isBooked?.isavailable
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                              onClick={() => {
                                if (!isPastTimeSlot) {
                                  handleOpenModal(slot, dayIndex, isBooked);
                                } else {
                                  handleOpenModal(
                                    slot,
                                    dayIndex,
                                    isBooked,
                                    true
                                  );
                                }
                              }}
                              key={dayIndex}
                              className="py-2 px-3 text-center border-r-1 border-slate-300"
                            >
                              {isBooked?.isBooked &&
                              !isBooked?.ispartialpayment ? (
                                <div
                                  className={`flex items-center h-12 bg-green-50 rounded-md overflow-hidden max-w-xs`}
                                >
                                  <div className="w-2 h-12 bg-green-600"></div>
                                  <div className="px-2 text-start">
                                    <p
                                      className={`text-sm font-bold text-gray-800`}
                                    >
                                      {isBooked?.price &&
                                        `₹ ${isBooked?.price}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {isBooked?.startTime} -{" "}
                                      {isBooked?.endTime}
                                    </p>
                                  </div>
                                </div>
                              ) : isBooked?.isBooked &&
                                isBooked?.ispartialpayment ? (
                                <div
                                  className={`flex items-center h-12 bg-orange-50 rounded-md overflow-hidden max-w-xs`}
                                >
                                  <div className="w-2 h-12 bg-orange-600"></div>
                                  <div className="px-2 text-start">
                                    <p
                                      className={`text-sm font-bold text-gray-800`}
                                    >
                                      {isBooked?.price &&
                                        `₹ ${isBooked?.price}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {isBooked?.startTime} -{" "}
                                      {isBooked?.endTime}
                                    </p>
                                  </div>
                                </div>
                              ) : !isBooked?.isavailable || isPastTimeSlot ? (
                                <div
                                  style={{
                                    backgroundImage: `url(${MaskGroup})`,
                                  }}
                                  className={`flex items-center h-12 bg-slate-50 rounded-md overflow-hidden max-w-xs`}
                                >
                                  {/* <div className="w-2 h-12 bg-slate-600"></div> */}
                                  <div className="px-2 text-start">
                                    <p
                                      className={`text-sm font-bold text-gray-800`}
                                    >
                                      {isBooked?.price &&
                                        `₹ ${isBooked?.price}`}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`flex items-center h-12  rounded-md overflow-hidden max-w-xs`}
                                >
                                  <div className="px-2 text-start">
                                    <p
                                      className={`text-sm font-normal text-gray-800`}
                                    >
                                      {isBooked?.price &&
                                        `₹ ${isBooked?.price}`}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {!isMobile && timeSlots?.length > 0 && (
              <div
                className={`mt-4 flex space-x-4 text-sm ${
                  isMobile
                    ? "flex-column gap-2 justify-start items-start"
                    : "gap-3 items-center"
                }`}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                  <span>Not Available</span>
                </div>
                <div className="flex items-center m-0 mx-4">
                  <div className="w-4 h-4  border border-gray-300 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center m-0 mx-4">
                  <div className="w-4 h-4 bg-orange-600 rounded mr-2"></div>
                  <span>Book With Partial Payment</span>
                </div>
                <div className="flex items-center m-0 mx-4">
                  <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                  <span>Book With Full Payment</span>
                </div>
                <div className="flex items-center m-0 mx-4">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span>Book From Player App</span>
                </div>
              </div>
            )}
          </div>

          <Drawer
            open={drawerOpen}
            onClose={() => {
              setDrawerOpen(false);
            }}
            anchor={"right"}
          >
            {DrawerList}
          </Drawer>

          {openModal && (
            <EditModal
              open={openModal}
              setOpen={setOpenModal}
              selectedRow={selectedRow}
              handleCallBackApi={handleCallBackApi}
              location={selectedVenue}
              selectedCourt={selectedCourt}
              selectedSport={selectedSport}
            />
          )}
          {timingModal && (
            <SlotUpdateModal
              open={timingModal}
              setOpen={setTimingModal}
              handleCallBackApi={handleCallBackApi}
              location={selectedVenue}
              selectedCourt={selectedCourt}
              selectedSport={selectedSport}
              selectedDay={selectedDay}
            />
          )}
          {/*   {venueModal && (
            <EditVenueModal
              open={venueModal}
              setOpen={setVenueModal}
              handleCallBackApi={handleCallBackVenueApi}
              selectedVenue={selectedVenue}
            />
          )} */}
        </>
      )}
    </div>
  );
}
