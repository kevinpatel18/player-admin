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
  getAllRefundsReport,
  getAllSettlementReport,
  UpdateCancelBookingVenueStatus,
  updateTransactionRefundStatus,
} from "../../Libs/api";
import CustomTableContainer from "../../Component/CustomTableContainer";
import { formatIndianNumber } from "../../hooks/helper";
import {
  Drawer,
  Select,
  MenuItem,
  FormControl,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "../../Component/Loader";
import { styled } from "@mui/material/styles";

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

const ManagePayment = () => {
  const { user } = useContext(MyContext);
  const { isMobile, isTablet } = useBreakPoints();
  const [selectedTab, setSelectedTab] = useState("booking");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revenueDetails, setRevenueDetails] = useState({});
  console.log("revenueDetails: ", revenueDetails);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  console.log("selectedRowIds: ", selectedRowIds);
  const [loading, setloading] = useState(true);
  const [limit, setLimit] = useState(10); // default slimit
  const [totalPages, setTotalPages] = useState(0);
  const [offset, setOffset] = useState(0); // default offset
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
      let apiCall = await getAllSettlementReport({
        limit,
        offset,
        fromDate,
        toDate,
        userid,
      });

      if (apiCall.status) {
        console.log(apiCall.data, "apiCall.data");
        setRevenueDetails({
          rows: apiCall.data?.data,

          totalCollection: parseFloat(
            apiCall?.data?.total_player_amount_revenue || 0
          ).toFixed(2),
          totalVenueCollectionRecieved: parseFloat(
            +apiCall?.data?.total_player_amount_revenue -
              +apiCall?.data?.total_player_amount_revenue * 0.01 || 0
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
        let apiCall = await getAllRefundsReport({
          limit,
          offset,
          fromDate,
          toDate,
          userid,
        });

        if (apiCall.status) {
          console.log(apiCall.data, "apiCall.data");
          setRevenueDetails({
            rows: apiCall.data?.data,

            totalCollection: parseFloat(
              apiCall?.data?.total_player_amount_revenue || 0
            ).toFixed(2),
            totalVenueCollectionRecieved: parseFloat(
              +apiCall?.data?.total_player_amount_revenue -
                +apiCall?.data?.total_player_amount_revenue * 0.01 || 0
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
      title: "Sr. No.",
      render: (cell, data, index) => {
        return <span>{index + 1}</span>;
      },
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
      title: "Sport",
      render: (cell) => {
        return <span>{cell?.sport?.name}</span>;
      },
      key: "sport.name",
    },
    {
      title: "Slot Booked",
      render: (cell) => {
        return <span>{cell?.totalSlot}</span>;
      },
      key: "totalSlot",
    },
    {
      title: "Slot Date",
      render: (cell) => {
        return (
          <span>
            {cell?.bookingDate
              ? moment(cell?.bookingDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : ""}
          </span>
        );
      },
      key: "bookingDate",
    },

    {
      title: "Total Amount",
      dataIndex: "totalPriceplayerAmount",
      key: "totalPriceplayerAmount",
    },
    {
      title: "Amount After Commission",
      render: (cell) => {
        return (
          <span>
            {+cell?.totalPriceplayerAmount -
              +cell?.totalPriceplayerAmount * 0.01}
          </span>
        );
      },
      key: "amounttotalPriceplayerAmount",
    },
  ];
  const cancelBookingColumns = [
    {
      title: "Sr. No.",
      render: (cell, data, index) => {
        return <span>{index + 1}</span>;
      },
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
      title: "Sport",
      render: (cell) => {
        return <span>{cell?.sport?.name}</span>;
      },
      key: "sport.name",
    },
    {
      title: "Slot Booked",
      render: (cell) => {
        return <span>{cell?.totalSlot}</span>;
      },
      key: "totalSlot",
    },
    {
      title: "Slot Date",
      render: (cell) => {
        return (
          <span>
            {cell?.bookingDate
              ? moment(cell?.bookingDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : ""}
          </span>
        );
      },
      key: "bookingDate",
    },

    {
      title: "Total Amount",
      dataIndex: "totalPriceplayerAmount",
      key: "totalPriceplayerAmount",
    },
    {
      title: "Refund Amount",
      render: (cell) => {
        return (
          <span>
            {+cell?.totalPriceplayerAmount -
              +cell?.totalPriceplayerAmount * 0.01}
          </span>
        );
      },
      key: "amounttotalPriceplayerAmount",
    },
    {
      title: "UPI ID",
      dataIndex: "upiId",
      key: "upiId",
    },
    {
      title: "Status",
      render: (cell) => {
        return (
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={cell?.status}
                disabled={cell?.status}
                onChange={(e) => {
                  updateStatus(cell?.transactionId);
                }}
              />
            }
            // labelPlacement="start"
            sx={{ width: isTablet ? "auto" : "15%", textWrap: "nowrap" }}
          />
        );
      },
      key: "amounttotalPriceplayerAmount",
    },
  ];

  const updateStatus = async (id) => {
    let arr = [];
    arr?.push(id);

    let formData = {
      transactionIds: JSON.stringify(arr),
    };

    setloading(true);

    try {
      const apiCall = await updateTransactionRefundStatus(formData);
      if (apiCall.status) {
        console.log(apiCall, "apiCall");

        setloading(false);
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
        // setOpen(false);
      } else {
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

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
                {selectedTab === "booking"
                  ? "  Total Collection"
                  : "  Total Refunds"}
              </h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹</span>
              <span className="text-2xl font-bold">
                {formatIndianNumber(revenueDetails?.totalCollection || 0)}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="w-full md:w-[300px] bg-white rounded-3xl shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-grey-100">
                <RefreshCcw className="w-5 h-5 text-grey-500" />
              </div>
              <h2 className="text-xl text-grey-500 font-medium">
                {selectedTab === "booking"
                  ? "Amount Venue Received"
                  : "Pending Refunds"}
              </h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹</span>
              <span className="text-2xl font-bold">
                {formatIndianNumber(
                  revenueDetails?.totalVenueCollectionRecieved || 0
                )}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {!isTablet && (
        <div>
          <div className={`flex justify-end items-center gap-4 mt-10`}>
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
            <Tab label={"Settlements"} value={"booking"} />
            <Tab label={"Refunds"} value={"cancel"} />
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
              rows={revenueDetails?.rows}
              columns={cancelBookingColumns}
              limit={limit}
              offset={offset}
              total={totalPages}
              setOffset={setOffset}
              setLimit={setLimit}
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

export default ManagePayment;
