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
} from "../../Libs/api";
import CustomTableContainer from "../../Component/CustomTableContainer";
import { formatIndianNumber } from "../../hooks/helper";
import { Drawer, Select, MenuItem, FormControl } from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RevenueSummary = () => {
  const { user } = useContext(MyContext);
  const { isMobile, isTablet } = useBreakPoints();
  const [selectedTab, setSelectedTab] = useState("booking");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revenueDetails, setRevenueDetails] = useState({});
  console.log("revenueDetails: ", revenueDetails);
  const [loading, setloading] = useState(true);
  const [limit, setLimit] = useState(10); // default slimit
  const [totalPages, setTotalPages] = useState(0);
  const [offset, setOffset] = useState(1); // default offset
  const [currentDate, setCurrentDate] = useState(new Date());
  const [query, setQuery] = useState({
    selectedRange: "week",
    dateRange: "",
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

  const callAPI = useCallback(async (limit, offset, startDate, endDate) => {
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
        userid,
      });

      if (apiCall.status) {
        console.log(apiCall.data, "apiCall.data");
        setRevenueDetails({
          rows: apiCall.data,
          groundRevenue: parseFloat(apiCall?.total_ground_revenue || 0).toFixed(
            2
          ),
          playerRevneue: parseFloat(apiCall?.total_player_revenue || 0).toFixed(
            2
          ),
          totalRevenue: parseFloat(
            parseInt(apiCall?.total_player_revenue || 0) +
              parseInt(apiCall?.total_ground_revenue || 0)
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
  }, []);
  const callCancelBookingAPI = useCallback(
    async (limit, offset, startDate, endDate) => {
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
              apiCall?.total_player_revenue || 0
            ).toFixed(2),
            totalRevenue: parseFloat(
              parseInt(apiCall?.total_player_revenue || 0) +
                parseInt(apiCall?.total_ground_revenue || 0)
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

  useEffect(() => {
    const { startDate, endDate } = getDateRange(
      query?.selectedRange,
      currentDate
    );
    const fromDate = format(startDate, "yyyy-MM-dd");
    const toDate = format(endDate, "yyyy-MM-dd");

    if (query?.selectedRange !== "custom") {
      if (selectedTab === "booking") {
        callAPI(limit, offset, fromDate, toDate);
      } else if (selectedTab === "cancel") {
        callCancelBookingAPI(limit, offset, fromDate, toDate);
      }
    }
    // eslint-disable-next-line
  }, [limit, offset, currentDate, query?.selectedRange, selectedTab]);

  useEffect(() => {
    if (query?.dateRange[0] && query?.dateRange[1]) {
      const start = dayjs(query?.dateRange[0]);
      const end = dayjs(query?.dateRange[1]);

      const fromDate = start.format("YYYY-MM-DD");
      console.log("fromDate: ", fromDate);
      const toDate = end.format("YYYY-MM-DD");
      console.log("toDate: ", toDate);

      if (query?.selectedRange === "custom") {
        if (selectedTab === "booking") {
          callAPI(limit, offset, fromDate, toDate);
        } else if (selectedTab === "cancel") {
          callCancelBookingAPI(limit, offset, fromDate, toDate);
        }
      }
    }
  }, [limit, offset, query?.dateRange, selectedTab]);

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

    {
      title: "Venue",
      render: (cell) => {
        return <span>{cell?.venue?.name}</span>;
      },
      key: "venue.name",
    },
    {
      title: "Court ",
      render: (cell) => {
        return <span>{cell?.venueCourt?.courtName}</span>;
      },
      key: "venueCourt.courtName",
    },
    {
      title: "Sport",
      render: (cell) => {
        return <span>{cell?.venueSport?.name}</span>;
      },
      key: "venueSport.name",
    },
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
      title: "Player Amount",
      dataIndex: "playerAmount",
      key: "playerAmount",
    },
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
        <FormControl variant="outlined" size="small">
          <Select
            value={query?.selectedRange}
            onChange={handleRangeChange}
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
        <div className={`flex justify-between px-10 flex-col gap-3 w-full`}>
          {query?.selectedRange === "custom" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    </Box>
  );

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
                Player Collection
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
      </div>

      {!isTablet && (
        <div>
          <div className={`flex justify-end items-center gap-4 mt-10`}>
            <FormControl variant="outlined" size="medium">
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
          <CustomTableContainer
            rows={revenueDetails?.rows}
            columns={bookingColumns}
            limit={limit}
            offset={offset}
            total={totalPages}
            setOffset={setOffset}
            setLimit={setLimit}
          />
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
