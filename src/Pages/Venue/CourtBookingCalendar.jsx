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
  endOfWeek,
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
import { styled } from "@mui/material/styles";
import {
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Switch,
  Select,
  FormControlLabel,
} from "@mui/material";
import Loader from "../../Component/Loader";
import {
  getAllBookingSlots,
  getAreaDetails,
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
import TableLoader from "../../Component/TableLoader";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import EditVenueModal from "./EditVenueModal";
import WeekDayView from "./WeekDayView";
import SingleDayView from "./SingleDayView";

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

  const [allArea, setAllArea] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const { isTablet, isMobile } = useBreakPoints();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const location = useLocation();
  const [allVenue, setAllVenue] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [venueModal, setVenueModal] = useState(false);
  const [mode, setMode] = useState("week");

  const [allBookingDetails, setAllBookingDetails] = useState([]);
  const [allTodayCount, setAllTodayCount] = useState([]);
  const [loading, setloading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [timingModal, setTimingModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("week");
  console.log("selectedRange: ", selectedRange);

  const getDateRange = (selectedRange, currentDate) => {
    switch (selectedRange) {
      case "today":
        return { startDate: currentDate, endDate: currentDate };
      case "week":
        return {
          startDate: startOfWeek(currentDate, { weekStartsOn: 1 }),
          endDate: endOfWeek(currentDate, { weekStartsOn: 1 }),
        };
    }
  };

  const { startDate, endDate } = getDateRange(selectedRange, currentDate);

  const handlePrevWeek = () => {
    switch (selectedRange) {
      case "today":
        setCurrentDate(addDays(currentDate, -1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
    }
  };
  const handleNextWeek = () => {
    console.log("selectedRange: ", selectedRange);
    switch (selectedRange) {
      case "today":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
    }
  };

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    const socket = new WebSocket(
      // "ws://localhost:80"
      "wss://pllayer-backend-68514470993.us-central1.run.app"
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
          setloading(false);
          setAllBookingDetails(response.data);
          const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format

          const todaySlots = response?.data?.bookingSlots?.filter(
            (slot) => slot.date === today && slot.userName
          );

          setAllTodayCount(todaySlots);

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
        localStorage.setItem("locationId", arr?.[0]?.locationid);
        setSelectedLocation(arr?.[0]);
        callAPI(arr?.[0]?.name);
        setloading(false);
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
        setloading(false);
        // setAllVenue(apiCall.data);

        setAllVenue(apiCall?.data);

        if (apiCall?.data?.length > 0) {
          updateSelectedVenue(apiCall?.data?.[0]);
          updateSelectedCourt(
            apiCall?.data?.[0]?.sports?.[0]?.courts?.[0]?.venuecourtid
          );
          updateSelectedSport(apiCall?.data?.[0]?.sports?.[0]);
        }
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
      const { startDate, endDate } = getDateRange(selectedRange, currentDate);

      let formData = {
        venueId: selectedVenue?.venueId,
        sportId: selectedSport?.sportid,
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
        admin: true,
      };

      console.log("mode: ", mode);
      if (mode === "week") {
        formData.venueCourtId = selectedCourt;
      }

      // setloading(true);
      getAllBookingSlotsWebSocket(formData);
    }
    // eslint-disable-next-line
  }, [mode, selectedVenue, selectedCourt, selectedSport, currentDate, counter]);

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
      sportId: selectedSport?.sportid,
      fromDate: moment(startDate).format("YYYY-MM-DD"),
      toDate: moment(endDate).format("YYYY-MM-DD"),
      admin: true,
    };

    if (mode === "week") {
      formData.venueCourtId = selectedCourt;
    }

    getAllBookingSlotsWebSocket(formData);
    // setloading(true);
    // allBookingCallAPI(formData);
  };

  const handleEditSlotTiming = (day) => {
    setTimingModal(true);
    setSelectedDay(day);
  };

  const updateLocation = async (value, locationId) => {
    // setloading(true);
    setSelectedLocation(value);
    localStorage.setItem("locationId", locationId);

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
            {selectedRange === "today"
              ? `${format(startDate, "d MMM")}`
              : `${format(startDate, "d MMM")} - ${format(
                  endDate,
                  "d MMM yyyy"
                )}`}
          </span>
          <ChevronRight
            className="w-5 h-5 text-gray-500 cursor-pointer"
            onClick={handleNextWeek}
          />
        </div>

        {user?.role === "admin" && (
          <FormControl size="small" className="w-[200px] bg-white">
            <InputLabel id="location-select-label">City</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={selectedLocation}
              label="Location"
              onChange={(e) => {
                updateLocation(e.target.value, e.target.value?.locationid);

                setloading(true);
              }}
            >
              {locationList?.map((item, i) => (
                <MenuItem value={item} key={i}>
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
              setloading(true);
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
              setloading(true);
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

        {user?.role !== "venueStaff" && user?.role !== "admin" && (
          <Button
            variant="outline"
            style={{ padding: "10px 23px", width: "85%" }}
            onClick={() => {
              setVenueModal(true);
            }}
            className="bg-black mx-5 text-white hover:bg-gray-800 flex items-center  rounded "
          >
            <Calendar className="w-4 h-4 mr-2" />
            Manage Venue
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => {
            downloadExcel();
          }}
          style={{ padding: "10px 23px", width: "85%" }}
          className="bg-black text-white hover:bg-gray-800 flex items-center mb-3 rounded "
        >
          Export Excel
        </Button>
      </div>
    </Box>
  );
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const downloadExcel = () => {
    const fileName = `Today-Booking-Report`;
    let apiData = [];
    let columnWidths = [];

    apiData = allTodayCount?.map((er) => ({
      Date: moment(er?.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
      "Start Time": er?.startTime,
      "End Time": er?.endTime,
      Price: er.price,
      Username: er.userName,
      "Mobile No": er.phoneNumber,
    }));

    columnWidths = [30, 30, 30, 30, 30, 30, 30, 30];

    const ws = XLSX.utils.json_to_sheet(apiData);

    ws["!cols"] = columnWidths.map((width) => ({ wch: width }));

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
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
      let query = {
        location: selectedLocation?.name,
      };
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

  if (loading) {
    return <TableLoader />;
  }
  return (
    <div style={{ width: "100%" }}>
      <div className="p-4">
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
                {selectedRange === "today"
                  ? `${format(startDate, "d MMM")}`
                  : `${format(startDate, "d MMM")} - ${format(
                      endDate,
                      "d MMM yyyy"
                    )}`}
              </span>
              <ChevronRight
                className="w-5 h-5 text-gray-500 cursor-pointer"
                onClick={handleNextWeek}
              />
            </div>

            {user?.role === "admin" && (
              <FormControl size="small" className="w-[200px] bg-white">
                <InputLabel id="location-select-label">City</InputLabel>
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  value={selectedLocation}
                  label="Location"
                  onChange={(e) => {
                    updateLocation(e.target.value, e.target.value?.locationid);
                    setloading(true);
                  }}
                >
                  {locationList?.map((item, i) => (
                    <MenuItem value={item} key={i}>
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
                  setloading(true);
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
                  setloading(true);
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

            {user?.role !== "venueStaff" && user?.role !== "admin" && (
              <Button
                variant="outline"
                style={{ padding: "10px 23px" }}
                onClick={() => {
                  setVenueModal(true);
                }}
                className="bg-black mx-5 text-white hover:bg-gray-800 flex items-center mb-3 rounded "
              >
                <Calendar className="w-4 h-4 mr-2" />
                Manage Venue
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                downloadExcel();
              }}
              style={{ padding: "10px 23px" }}
              className="bg-black mx-5 text-white hover:bg-gray-800 flex items-center mb-3 rounded "
            >
              Export Excel
            </Button>
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
      </div>

      {!isTablet && (
        <div className="px-4">
          <div className="flex justify-end"></div>
        </div>
      )}
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
            <div className="flex justify-end">
              <div className="col-md-6">
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={mode === "week" ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMode("week");
                          setSelectedRange("week");
                        } else {
                          setMode("day");
                          setSelectedRange("today");
                        }
                      }}
                    />
                  }
                  label={"Week View"}
                  labelPlacement="start"
                  sx={{ justifyContent: "flex-end", display: "flex" }}
                />
              </div>
            </div>

            {mode === "week" && (
              <WeekDayView
                selectedCourt={selectedCourt}
                setloading={setloading}
                updateSelectedCourt={updateSelectedCourt}
                addDays={addDays}
                selectedSport={selectedSport}
                startDate={startDate}
                isToday={isToday}
                handleEditSlotTiming={handleEditSlotTiming}
                timeSlots={timeSlots}
                allBookingDetails={allBookingDetails}
                handleOpenModal={handleOpenModal}
              />
            )}
            {mode === "day" && (
              <SingleDayView
                selectedCourt={selectedCourt}
                setloading={setloading}
                updateSelectedCourt={updateSelectedCourt}
                addDays={addDays}
                selectedSport={selectedSport}
                startDate={startDate}
                isToday={isToday}
                handleEditSlotTiming={handleEditSlotTiming}
                timeSlots={timeSlots}
                allBookingDetails={allBookingDetails}
                handleOpenModal={handleOpenModal}
              />
            )}

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

      {venueModal && (
        <EditVenueModal
          open={venueModal}
          setOpen={setVenueModal}
          handleCallBackApi={handleCallBackVenueApi}
          selectedVenue={selectedVenue}
        />
      )}
    </div>
  );
}
