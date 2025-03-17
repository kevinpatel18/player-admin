import React, { useCallback, useContext, useEffect, useState } from "react";
import { RefreshCcw, Filter } from "lucide-react";
import { Button, Card, CardBody } from "reactstrap";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";
import useBreakPoints from "../../hooks/useBreakPoints";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { MyContext } from "../../hooks/MyContextProvider";
import { toast } from "react-toastify";
import moment from "moment";
import {
  getAllCancelBookingReport,
  getAllRevenueAnalysisReport,
  getAllVenue,
  getAreaDetails,
  getLocationDetails,
  UpdateCancelBookingVenueStatus,
} from "../../Libs/api";
import CustomTableContainer from "../../Component/CustomTableContainer";
import { formatIndianNumber } from "../../hooks/helper";
import {
  Drawer,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "../../Component/Loader";
import Swal from "sweetalert2";

const RevenueSummary = () => {
  const { user } = useContext(MyContext);
  const { isMobile, isTablet } = useBreakPoints();
  const [selectedTab, setSelectedTab] = useState("booking");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revenueDetails, setRevenueDetails] = useState({});
  console.log("revenueDetails: ", revenueDetails);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [loading, setloading] = useState(true);
  const [limit, setLimit] = useState(10); // default slimit
  const [totalPages, setTotalPages] = useState(0);
  const [offset, setOffset] = useState(0); // default offset
  const [allArea, setAllArea] = useState([]);
  const [allVenue, setAllVenue] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [query, setQuery] = useState({
    selectedRange: "today",
    dateRange: "",
    selectedLocation: "",
    selectedSport: "",
    selectedCourts: "All",
    selectedVenue: null,
  });
  console.log("query: ", query);

  const getDateRange = (selectedRange, currentDate) => {
    switch (selectedRange) {
      case "today":
        return { startDate: currentDate, endDate: currentDate };
      case "week":
        return {
          startDate: startOfWeek(currentDate, { weekStartsOn: 1 }),
          endDate: endOfWeek(currentDate, { weekStartsOn: 1 }),
        };
      case "month":
        return {
          startDate: startOfMonth(currentDate),
          endDate: endOfMonth(currentDate),
        };
      default:
        return {
          startDate: startOfWeek(currentDate, { weekStartsOn: 1 }),
          endDate: endOfWeek(currentDate, { weekStartsOn: 1 }),
        };
    }
  };

  const { startDate, endDate } = getDateRange(
    query?.selectedRange,
    currentDate
  );

  const handlePrevWeek = () => {
    // eslint-disable-next-line
    switch (query?.selectedRange) {
      case "today":
        setCurrentDate(addDays(currentDate, -1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNextWeek = () => {
    // eslint-disable-next-line
    switch (query?.selectedRange) {
      case "today":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleRangeChange = (event) => {
    setQuery({ ...query, selectedRange: event.target.value });
    setCurrentDate(new Date()); // Reset to current date when changing range
  };

  const handleDateRangeChange = (newDateRange) => {
    setQuery({ ...query, dateRange: newDateRange });
  };

  const formatDate = (date) => {
    try {
      return format(date, "d MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const callAPI = useCallback(
    async (
      limit,
      offset,
      startDate,
      endDate,
      locationId,
      venueSportId,
      venueId,
      courtId
    ) => {
      try {
        setloading(true);

        const fromDate = moment(startDate).format("YYYY-MM-DD");
        const toDate = moment(endDate).format("YYYY-MM-DD");
        let userid = "";
        if (user?.role !== "admin") {
          userid = user?.userid;
        }
        let apiCall = await getAllRevenueAnalysisReport({
          limit,
          offset,
          fromDate,
          toDate,
          locationId,
          venueSportId,
          venueId,
          courtId,
          userid,
        });

        if (apiCall.status) {
          setRevenueDetails({
            rows: apiCall.data?.filter((er) => !er?.isCancelBooking),
            cancelBookingRows: apiCall?.cancelbookingsData,
            groundRevenue: parseFloat(
              apiCall?.total_ground_revenue || 0
            ).toFixed(2),
            playerRevneue: parseFloat(
              apiCall?.total_player_revenue -
                +apiCall?.total_player_revenue * 0.0118 || 0
            ).toFixed(2),
            totalRevenue: parseFloat(
              +parseFloat(
                apiCall?.total_player_revenue -
                  +apiCall?.total_player_revenue * 0.0118 || 0
              ).toFixed(2) +
                +parseInt(apiCall?.total_ground_revenue || 0) +
                parseFloat(apiCall?.total_pending_refund_revenue || 0)
            ).toFixed(2),

            total_pending_refund_revenue: parseFloat(
              apiCall?.total_pending_refund_revenue || 0
            ).toFixed(2),
          });
          setTotalPages(apiCall?.pagination?.total_items);
          setloading(false);
        } else {
          setloading(false);
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        setloading(false);
        toast.error("Something went wrong. Please try again later 1.");
      }
      // eslint-disable-next-line
    },
    []
  );
  const callCancelBookingAPI = useCallback(
    async (
      limit,
      offset,
      startDate,
      endDate,
      locationId,
      venueSportId,
      venueId,
      courtId
    ) => {
      try {
        setloading(true);

        const fromDate = moment(startDate).format("YYYY-MM-DD");
        const toDate = moment(endDate).format("YYYY-MM-DD");
        let userid = "";
        if (user?.role !== "admin") {
          userid = user?.userid;
        }
        let apiCall = await getAllCancelBookingReport({
          limit,
          offset,
          fromDate,
          toDate,
          locationId,
          venueSportId,
          venueId,
          courtId,
          userid,
        });

        if (apiCall.status) {
          console.log(apiCall.data, "apiCall.data");
          setRevenueDetails({
            rows: apiCall.data,
            groundRevenue: parseFloat(
              apiCall?.total_ground_revenue || 0
            ).toFixed(2),
            playerRevneue: parseFloat(
              apiCall?.total_player_revenue -
                +apiCall?.total_player_revenue * 0.0118 || 0
            ).toFixed(2),
            totalRevenue: parseFloat(
              +parseFloat(
                apiCall?.total_player_revenue -
                  +apiCall?.total_player_revenue * 0.0118 || 0
              ).toFixed(2) +
                +parseInt(apiCall?.total_ground_revenue || 0) +
                +apiCall?.total_pending_refund_revenue
            ).toFixed(2),
            total_pending_refund_revenue: parseFloat(
              apiCall?.total_pending_refund_revenue
            ).toFixed(2),
          });
          setTotalPages(apiCall?.pagination?.total_items);
          setloading(false);
        } else {
          setloading(false);
          toast.error(apiCall?.message);
        }
      } catch (error) {
        console.log(error);
        setloading(false);
        toast.error("Something went wrong. Please try again later.");
      }
      // eslint-disable-next-line
    },
    []
  );

  const getAllLocation = useCallback(async () => {
    try {
      const apiCall = await getLocationDetails();
      if (apiCall.status) {
        let obj = { ...query };
        setLocationList(apiCall.data);
        if (localStorage.getItem("locationId")) {
          let locationId = apiCall.data?.find(
            (er) => +er?.locationid === +localStorage.getItem("locationId")
          );
          obj.selectedLocation = locationId;
          callVenueAPI(locationId?.name, obj);
        } else {
          obj.selectedLocation = apiCall.data?.[0];

          callVenueAPI(apiCall.data?.[0]?.name, obj);
          localStorage.setItem("locationId", apiCall.data?.[0]?.locationid);
        }
      } else {
        setloading(false);
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, []);

  const callVenueAPI = useCallback(async (locationName, obj) => {
    console.log("locationName: ", locationName);
    try {
      let query = { location: locationName || "" };
      if (user?.role !== "admin") {
        query.userid = user?.userid;
      }

      const apiCall = await getAllVenue(query);
      if (apiCall.status) {
        setAllVenue(apiCall.data);
        if (apiCall?.data?.[0]?.venueId) {
          obj.selectedVenue = apiCall?.data?.[0];
          obj.selectedSport = apiCall?.data?.[0]?.sports?.[0];

          setQuery(obj);
        } else {
          setQuery(obj);
        }
      } else {
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      getAllLocation();
    } else {
      let obj = { ...query };

      callVenueAPI("", obj);
    }
  }, []);

  useEffect(() => {
    if (
      query?.selectedVenue === "" ||
      (query?.selectedVenue && user?.role === "admin")
    ) {
      const { startDate, endDate } = getDateRange(
        query?.selectedRange,
        currentDate
      );
      const fromDate = format(startDate, "yyyy-MM-dd");
      const toDate = format(endDate, "yyyy-MM-dd");

      if (query?.selectedRange !== "custom") {
        // if (selectedTab === "booking") {
        callAPI(
          limit,
          offset,
          fromDate,
          toDate,
          query?.selectedLocation?.locationid,
          query?.selectedSport?.sportid,
          query?.selectedVenue?.venueId,
          query?.selectedCourts !== "All" && query?.selectedCourts
        );
        // } else if (selectedTab === "cancel") {
        //   callCancelBookingAPI(
        //     limit,
        //     offset,
        //     fromDate,
        //     toDate,
        //     query?.selectedLocation?.locationid,
        //     query?.selectedSport?.sportid,
        //     query?.selectedVenue?.venueId,
        //     query?.selectedCourts !== "All" && query?.selectedCourts
        //   );
        // }
      }
    }
    // eslint-disable-next-line
  }, [limit, offset, currentDate, query]);

  useEffect(() => {
    if (
      query?.selectedVenue === "" ||
      (query?.selectedVenue && user?.role === "admin")
    ) {
      if (query?.dateRange[0] && query?.dateRange[1]) {
        const start = dayjs(query?.dateRange[0]);
        const end = dayjs(query?.dateRange[1]);

        const fromDate = start.format("YYYY-MM-DD");
        console.log("fromDate: ", fromDate);
        const toDate = end.format("YYYY-MM-DD");
        console.log("toDate: ", toDate);

        if (query?.selectedRange === "custom") {
          // if (selectedTab === "booking") {
          callAPI(
            limit,
            offset,
            fromDate,
            toDate,
            query?.selectedLocation?.locationid,
            query?.selectedSport?.sportid,
            query?.selectedVenue?.venueId,
            query?.selectedCourts !== "All" && query?.selectedCourts
          );
          // } else if (selectedTab === "cancel") {
          //   callCancelBookingAPI(
          //     limit,
          //     offset,
          //     fromDate,
          //     toDate,
          //     query?.selectedLocation?.locationid,
          //     query?.selectedSport?.sportid,
          //     query?.selectedVenue?.venueId,
          //     query?.selectedCourts !== "All" && query?.selectedCourts
          //   );
          // }
        }
      }
    }
  }, [limit, offset, query]);

  useEffect(() => {
    if (user?.role !== "admin") {
      const { startDate, endDate } = getDateRange(
        query?.selectedRange,
        currentDate
      );
      const fromDate = format(startDate, "yyyy-MM-dd");
      const toDate = format(endDate, "yyyy-MM-dd");

      if (query?.selectedRange !== "custom") {
        // if (selectedTab === "booking") {
        callAPI(
          limit,
          offset,
          fromDate,
          toDate,
          "",
          query?.selectedSport?.sportid,
          query?.selectedVenue?.venueId,
          query?.selectedCourts !== "All" && query?.selectedCourts
        );
        // } else if (selectedTab === "cancel") {
        //   callCancelBookingAPI(
        //     limit,
        //     offset,
        //     fromDate,
        //     toDate,
        //     "",
        //     query?.selectedSport?.sportid,
        //     query?.selectedVenue?.venueId,
        //     query?.selectedCourts !== "All" && query?.selectedCourts
        //   );
        // }
      }
    }
    // eslint-disable-next-line
  }, [limit, offset, currentDate, query]);
  useEffect(() => {
    if (user?.role !== "admin") {
      if (query?.dateRange[0] && query?.dateRange[1]) {
        const start = dayjs(query?.dateRange[0]);
        const end = dayjs(query?.dateRange[1]);

        const fromDate = start.format("YYYY-MM-DD");
        console.log("fromDate: ", fromDate);
        const toDate = end.format("YYYY-MM-DD");
        console.log("toDate: ", toDate);

        if (query?.selectedRange === "custom") {
          // if (selectedTab === "booking") {
          callAPI(
            limit,
            offset,
            fromDate,
            toDate,
            "",
            query?.selectedSport?.sportid,
            query?.selectedVenue?.venueId,
            query?.selectedCourts !== "All" && query?.selectedCourts
          );
          // } else if (selectedTab === "cancel") {
          //   callCancelBookingAPI(
          //     limit,
          //     offset,
          //     fromDate,
          //     toDate,
          //     "",
          //     query?.selectedSport?.sportid,
          //     query?.selectedVenue?.venueId,
          //     query?.selectedCourts !== "All" && query?.selectedCourts
          //   );
          // }
        }
      }
    }
  }, [limit, offset, query]);

  const bookingColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },

    {
      width: 200,
      title: "Full Name",
      render: (cell) => {
        return <span className="capitalize">{cell?.users?.username}</span>;
      },
    },
    {
      width: 200,
      title: "Mobile Number",
      render: (cell) => {
        return <span className="capitalize">{cell?.users?.phoneNumber}</span>;
      },
    },

    // {
    //   title: "Venue",
    //   render: (cell) => {
    //     return <span>{cell?.venue?.name}</span>;
    //   },
    //   key: "venue.name",
    // },
    {
      title: "Court ",
      render: (cell) => {
        return <span>{cell?.venueCourt?.courtName}</span>;
      },
      key: "venueCourt.courtName",
    },
    // {
    //   title: "Sport",
    //   render: (cell) => {
    //     return <span>{cell?.venueSport?.name}</span>;
    //   },
    //   key: "venueSport.name",
    // },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Ground Amount",
      dataIndex: "groundAmount",
      key: "groundAmount",
    },
    {
      title: "Pllayer Amount",
      render: (cell) => {
        return (
          <span>
            {parseFloat(
              +cell?.playerAmount - +cell?.playerAmount * 0.0118 || 0
            ).toFixed(2)}
          </span>
        );
      },
      key: "playerAmount",
    },
  ];
  const cancelBookingColumns = [
    {
      title: "Date",
      render: (cell) => {
        return <span>{moment(cell?.date).format("DD-MM-YYYY")}</span>;
      },
      key: "date",
    },

    {
      width: 200,
      title: "Full Name",
      render: (cell) => {
        return <span className="capitalize">{cell?.users?.username}</span>;
      },
    },
    {
      width: 200,
      title: "Mobile Number",
      render: (cell) => {
        return <span className="capitalize">{cell?.users?.phoneNumber}</span>;
      },
    },

    // {
    //   title: "Venue",
    //   render: (cell) => {
    //     return <span>{cell?.venue?.name}</span>;
    //   },
    //   key: "venue.name",
    // },
    {
      title: "Court ",
      render: (cell) => {
        return <span>{cell?.venueCourt?.courtName}</span>;
      },
      key: "venueCourt.courtName",
    },
    // {
    //   title: "Sport",
    //   render: (cell) => {
    //     return <span>{cell?.venueSport?.name}</span>;
    //   },
    //   key: "venueSport.name",
    // },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Ground Amount",
      dataIndex: "groundAmount",
      key: "groundAmount",
    },
    {
      title: "Pllayer Amount",
      render: (cell) => {
        return (
          <span>
            {parseFloat(
              +cell?.playerAmount - +cell?.playerAmount * 0.0118 || 0
            ).toFixed(2)}
          </span>
        );
      },
      key: "playerAmount",
    },
    {
      title: "Refund Date",
      render: (cell) => {
        return (
          <span>{moment(cell?.createdAt).format("DD-MM-YYYY hh:mm A")}</span>
        );
      },
      key: "date",
    },
    {
      title: "Refunded Pllayer Amount",
      render: (cell) => {
        return <span>{parseFloat(cell?.refundAmount || 0).toFixed(2)}</span>;
      },
      key: "refundAmount",
    },
    // {
    //   title: "Status",
    //   render: (cell) => {
    //     console.log(cell);
    //     return (
    //       <span
    //         style={{
    //           color:
    //             cell?.status === "Pending"
    //               ? "rgb(247 184 75)"
    //               : cell?.status === "Completed"
    //               ? "rgb(10 179 156)"
    //               : "",
    //           backgroundColor:
    //             cell?.status === "Pending"
    //               ? "#fef4e4"
    //               : cell?.status === "Completed"
    //               ? "#daf4f0"
    //               : "",
    //           padding: "0.65em 0.35em",
    //           fontSize: 12,
    //           borderRadius: 4,
    //           fontWeight: 600,
    //         }}
    //       >
    //         {cell?.status}
    //       </span>
    //     );
    //   },
    //   key: "status",
    // },
  ];

  const DrawerList = (
    <Box
      sx={{ width: 350 }}
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
        className={`flex w-full justify-start flex-col gap-5 items-center mb-4 mt-5  ${
          isMobile ? "flex-column gap-3" : ""
        }`}
      >
        {user?.role === "admin" && (
          <FormControl size="small" fullWidth className=" w-[200px] bg-white ">
            <InputLabel className="custom-mx" id="location-select-label">
              Location
            </InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={query?.selectedLocation}
              className="custom-mx"
              label="Location"
              onChange={(e) => {
                let obj = { ...query };

                obj.selectedLocation = e.target.value;
                obj.selectedSport = "";
                obj.selectedVenue = "";

                localStorage.setItem("locationId", e.target.value?.locationid);
                callVenueAPI(e.target.value?.name, obj);
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

        {user?.role === "admin" && (
          <FormControl fullWidth size="small" className="w-[200px]">
            <InputLabel className="custom-mx" id="venue-select-label">
              Venue
            </InputLabel>
            <Select
              labelId="venue-select-label"
              className="custom-mx"
              id="venue-select"
              value={query?.selectedVenue}
              label="Venue"
              onChange={(e) => {
                setloading(true);
                setQuery({
                  ...query,
                  selectedVenue: e.target.value,
                  selectedCourts: "All",
                });
              }}
            >
              <MenuItem value={""}>All</MenuItem>
              {allVenue?.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth size="small" className="w-[200px]">
          <InputLabel className="custom-mx" id="sport-select-label">
            Sport
          </InputLabel>
          <Select
            labelId="sport-select-label"
            id="sport-select"
            className="custom-mx"
            value={query?.selectedSport}
            label="Sport"
            onChange={(e) => {
              setloading(true);
              setQuery({
                ...query,
                selectedSport: e.target.value,
                selectedCourts: "All",
              });
            }}
          >
            {query?.selectedVenue?.sports?.map((item, i) => (
              <MenuItem value={item} key={i}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" className="w-[200px]">
          <InputLabel className="custom-mx" id="sport-select-label">
            Courts
          </InputLabel>
          <Select
            labelId="sport-select-label"
            id="sport-select"
            className="custom-mx"
            value={query?.selectedCourts}
            label="Sport"
            onChange={(e) => {
              setloading(true);
              setQuery({ ...query, selectedCourts: e.target.value });
            }}
          >
            <MenuItem value={"All"}>All</MenuItem>
            {query?.selectedSport?.courts?.map((item, i) => (
              <MenuItem value={item?.venuecourtid} key={i}>
                {item?.courtname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined" size="small">
          <Select
            fullWidth
            value={query?.selectedRange}
            onChange={handleRangeChange}
            className="custom-mx"
            sx={{
              width: 265,
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
        <div className={` flex justify-between  flex-col gap-3 w-full`}>
          {query?.selectedRange === "custom" ? (
            <LocalizationProvider
              className="custom-mx"
              fullWidth
              dateAdapter={AdapterDayjs}
            >
              <DemoContainer
                sx={{ width: "100%" }}
                components={["DateRangePicker"]}
              >
                <DateRangePicker
                  localeText={{ start: "From Date", end: "To Date" }}
                  value={query?.dateRange}
                  format="DD/MM/YYYY"
                  onChange={handleDateRangeChange}
                />
              </DemoContainer>
            </LocalizationProvider>
          ) : (
            <div className="custom-mx flex items-center space-x-2 bg-black rounded-md px-4 py-3 ">
              <ChevronLeft
                className="w-5 h-5 text-white cursor-pointer"
                onClick={handlePrevWeek}
              />
              <span className="text-sm font-medium text-white">
                {query?.selectedRange === "today"
                  ? `${formatDate(startDate)}`
                  : `${formatDate(startDate)} - ${formatDate(endDate)}`}
              </span>
              <ChevronRight
                className="w-5 h-5 text-white cursor-pointer"
                onClick={handleNextWeek}
              />
            </div>
          )}
        </div>
      </div>
    </Box>
  );

  const handleUpdateStatus = async () => {
    setloading(true);

    let formData = {
      cancelBookingVenueIds: selectedRowIds,
      status: "Completed",
    };
    try {
      const apiCall = await UpdateCancelBookingVenueStatus(formData);
      if (apiCall.status) {
        console.log(apiCall, "apiCall");
        const { startDate, endDate } = getDateRange(
          query?.selectedRange,
          currentDate
        );
        const fromDate = format(startDate, "yyyy-MM-dd");
        const toDate = format(endDate, "yyyy-MM-dd");
        callCancelBookingAPI(limit, offset, fromDate, toDate);
        setloading(false);
      } else {
        setloading(false);
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    if (selectedRowIds?.length > 0) {
      handleUpdateStatus();
    }
  }, [selectedRowIds]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 ">
        <Card className="w-full md:w-[300px] bg-white rounded-3xl shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100">
                <RefreshCcw className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl text-gray-700 font-medium">
                Total Collection
              </h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹</span>
              <span className="text-2xl font-bold">
                {formatIndianNumber(revenueDetails?.totalRevenue || 0)}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="w-full md:w-[300px] bg-white rounded-3xl shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-orange-100">
                <RefreshCcw className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-xl text-orange-500 font-medium">
                Pllayer Collection
              </h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹</span>
              <span className="text-2xl font-bold">
                {formatIndianNumber(revenueDetails?.playerRevneue || 0)}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card className="w-full md:w-[300px] bg-white rounded-3xl shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-orange-100">
                <RefreshCcw className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl text-blue-500 font-medium">
                Ground Collection
              </h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹</span>
              <span className="text-2xl font-bold">
                {formatIndianNumber(revenueDetails?.groundRevenue || 0)}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card className="w-full md:w-[300px] bg-white rounded-3xl shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-orange-100">
                <RefreshCcw className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl text-blue-500 font-medium">
                Cancellation Collection
              </h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹</span>
              <span className="text-2xl font-bold">
                {formatIndianNumber(
                  revenueDetails?.total_pending_refund_revenue || 0
                )}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {!isTablet && (
        <div>
          <div className={`flex justify-end items-center gap-4 mt-10`}>
            {user?.role === "admin" && (
              <FormControl size="small" className="w-[200px] bg-white">
                <InputLabel id="location-select-label">Location</InputLabel>
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  value={query?.selectedLocation}
                  label="Location"
                  onChange={(e) => {
                    let obj = { ...query };

                    obj.selectedLocation = e.target.value;
                    obj.selectedSport = "";
                    obj.selectedVenue = "";

                    localStorage.setItem(
                      "locationId",
                      e.target.value?.locationid
                    );
                    callVenueAPI(e.target.value?.name, obj);
                  }}
                >
                  <MenuItem value={""}>All</MenuItem>
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
                value={query?.selectedVenue}
                label="Venue"
                onChange={(e) => {
                  setloading(true);
                  setQuery({
                    ...query,
                    selectedVenue: e.target.value,
                    selectedSport: e.target.value?.sports?.[0],
                    selectedCourts: "All",
                  });
                }}
              >
                <MenuItem value={""}>All</MenuItem>
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
                value={query?.selectedSport}
                label="Sport"
                onChange={(e) => {
                  setloading(true);
                  setQuery({
                    ...query,
                    selectedSport: e.target.value,
                    selectedCourts: "All",
                  });
                }}
              >
                {query?.selectedVenue?.sports?.map((item, i) => (
                  <MenuItem value={item} key={i}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" className="w-[200px]">
              <InputLabel id="sport-select-label">Courts</InputLabel>
              <Select
                labelId="sport-select-label"
                id="sport-select"
                value={query?.selectedCourts}
                label="Sport"
                onChange={(e) => {
                  setloading(true);
                  setQuery({ ...query, selectedCourts: e.target.value });
                }}
              >
                <MenuItem value={"All"}>All</MenuItem>
                {query?.selectedSport?.courts?.map((item, i) => (
                  <MenuItem value={item?.venuecourtid} key={i}>
                    {item?.courtname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small">
              <Select
                value={query?.selectedRange}
                onChange={handleRangeChange}
                sx={{
                  width: 150,
                }}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {query?.selectedRange === "custom" ? (
              <LocalizationProvider
                size="small"
                sx={{ padding: 0 }}
                dateAdapter={AdapterDayjs}
              >
                <DemoContainer
                  size="small"
                  sx={{ padding: 0 }}
                  components={["DateRangePicker"]}
                >
                  <DateRangePicker
                    localeText={{ start: "From Date", end: "To Date" }}
                    value={query?.dateRange}
                    size="small"
                    sx={{ padding: 0 }}
                    format="DD/MM/YYYY"
                    className="custom-date-picker"
                    onChange={handleDateRangeChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            ) : (
              <div className="flex items-center space-x-2 bg-black rounded-md px-4 py-3 ">
                <ChevronLeft
                  className="w-5 h-5 text-white cursor-pointer"
                  onClick={handlePrevWeek}
                />
                <span className="text-sm font-medium text-white">
                  {query?.selectedRange === "today"
                    ? `${formatDate(startDate)}`
                    : `${formatDate(startDate)} - ${formatDate(endDate)}`}
                </span>
                <ChevronRight
                  className="w-5 h-5 text-white cursor-pointer"
                  onClick={handleNextWeek}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {isTablet && (
        <div className="flex justify-end mt-10">
          <Button
            variant="outline"
            onClick={() => {
              setDrawerOpen(true);
            }}
            style={{ padding: "10px 23px" }}
            className="bg-black text-white hover:bg-gray-800 flex items-center mb-3 rounded "
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filter
          </Button>
        </div>
      )}

      <div
        className="mt-2 border-1 border-slate-300 border-bottom-none bg-white"
        style={{ borderRadius: "8px 8px 0px 0px" }}
      >
        <Box
          sx={{
            flexGrow: 1,

            borderRadius: "8px 8px 0px 0px",
            paddingLeft: 2,
            overflow: "auto",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => {
              console.log(newValue);
              setSelectedTab(newValue);
            }}
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
          >
            <Tab label={"Booking Overview"} value={"booking"} />
            <Tab label={"Cancel Booking Overview"} value={"cancel"} />
          </Tabs>
        </Box>
        <div className="table-responsive pb-2">
          {selectedTab === "booking" && (
            <CustomTableContainer
              rows={revenueDetails?.rows}
              columns={bookingColumns}
              limit={limit}
              offset={offset}
              total={totalPages}
              setOffset={setOffset}
              setLimit={setLimit}
            />
          )}
          {selectedTab === "cancel" && (
            // <CustomTableContainer
            //   rows={revenueDetails?.rows}
            //   columns={cancelBookingColumns}
            //   limit={limit}
            //   offset={offset}
            //   total={totalPages}
            //   setOffset={setOffset}
            //   setLimit={setLimit}
            // />
            <CustomTableContainer
              rows={revenueDetails?.cancelBookingRows}
              columns={cancelBookingColumns}
              limit={limit}
              rowKey={"cancelBookingVenueId"}
              offset={offset}
              total={totalPages}
              setOffset={setOffset}
              setLimit={setLimit}
              rowSelection={true}
              selectedRowIds={selectedRowIds}
              setSelectedRowIds={setSelectedRowIds}
            />
          )}
        </div>
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
    </div>
  );
};

export default RevenueSummary;
