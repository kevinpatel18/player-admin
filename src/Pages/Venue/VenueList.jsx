import React, { useCallback, useContext, useEffect, useState } from "react";
import { getAllUserReport, getAllVenue } from "../../Libs/api";
import { toast } from "react-toastify";
import CustomTableContainer from "../../Component/CustomTableContainer";
import Loader from "../../Component/Loader";
import { MyContext } from "../../hooks/MyContextProvider";
import { set } from "date-fns";
import { TextField } from "@mui/material";
import { Filter, BookmarkX, Edit2Icon, Edit, Plus } from "lucide-react";
import { Button } from "reactstrap";
import moment from "moment";
import Box from "@mui/material/Box";
import { Drawer } from "@mui/material";
import useBreakPoints from "../../hooks/useBreakPoints";
import { useNavigate } from "react-router-dom";
import EditVenue from "./EditVenue";

const VenueList = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakPoints();
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setloading] = useState(true);
  const [limit, setLimit] = useState(10); // default slimit
  const [offset, setOffset] = useState(0); // default offset
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState({
    name: "",
    phoneNumber: "",
  });

  const callAPI = useCallback(async (limit, offset) => {
    try {
      setloading(true);
      const apiCall = await getAllVenue({ limit, offset });
      if (apiCall.status) {
        setUserDetails(
          apiCall.data?.map((user) => {
            let obj = {
              ...user,
              bookingDetails: user?.booking_details || [],
            };

            delete obj.booking_details;

            return obj;
          })
        );
        setTotalPages(apiCall?.pagination?.total_items);
        setloading(false);
      } else {
        toast.error(apiCall?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    callAPI(limit, offset);
    // eslint-disable-next-line
  }, [limit, offset]);

  const columns = [
    {
      width: 200,
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      width: 200,
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 200,
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      width: 200,
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      width: 200,
      title: "Mobile Number",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },
    {
      width: 200,
      title: "Location",
      render: (cell) => {
        return <span>{cell?.location?.name}</span>;
      },
      key: "phoneNo",
    },
    {
      width: 200,
      title: "No of Sport",
      render: (cell) => {
        return <span>{cell?.sports?.length}</span>;
      },
      key: "sports",
    },
    {
      width: 200,
      title: "No of Court",
      render: (cell) => {
        return <span>{cell?.venueCourts?.length}</span>;
      },
    },
    {
      width: 200,
      title: "Max Days",
      dataIndex: "maxdays",
      key: "maxdays",
    },
    {
      width: 200,
      title: "Preamount",
      dataIndex: "preamount",
      key: "preamount",
    },
    {
      width: 200,
      title: "Action",
      render: (cell) => {
        return (
          <div
            style={{
              background: "black",
              padding: 5,
              borderRadius: 6,
              width: "fit-content",
            }}
          >
            <Edit
              onClick={() => {
                setSingleData(cell);
                setEditModal(true);
              }}
              className="cursor-pointer text-white"
              size={18}
            />
          </div>
        );
      },
      key: "action",
    },
  ];

  const handleApplyFilter = async (limit, offset, query) => {
    try {
      setloading(true);
      const apiCall = await getAllVenue({
        limit,
        offset,

        name: query?.name,
        phoneNumber: query?.phoneNumber,
      });
      if (apiCall.status) {
        setUserDetails(apiCall.data);
        setTotalPages(apiCall?.pagination?.total_items);
        setloading(false);
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
        <TextField
          type="text"
          size="small"
          id="outlined-controlled"
          label={` Full Name`}
          placeholder="Search for Full Name"
          className="mt-4"
          value={query?.name}
          onChange={(event) => {
            setQuery({ ...query, name: event.target.value });
          }}
        />
        <TextField
          type="number"
          size="small"
          id="outlined-controlled"
          label={`Phone Number`}
          placeholder="Search for Phone Number"
          className="mt-4"
          value={query?.phoneNumber}
          onChange={(event) => {
            setQuery({ ...query, phoneNumber: event.target.value });
          }}
        />

        <Button
          variant="outline"
          onClick={() => {
            handleApplyFilter(limit, offset, query);
          }}
          style={{ padding: "8px 23px" }}
          className="bg-black text-white hover:bg-gray-800 flex items-center rounded "
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setQuery({
              name: "",
              phoneNumber: "",
            });
            callAPI(10, 0);
            setLimit(10);
            setOffset(0);
          }}
          style={{ padding: "8px 23px" }}
          className="bg-orange-600 text-white hover:bg-orange-800 flex items-center rounded "
        >
          <BookmarkX className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </Box>
  );

  const handleCallBackVenueApi = () => {
    callAPI(limit, offset);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        {!isTablet && (
          <div className={`flex items-center gap-4 mt-10 px-7`}>
            <TextField
              type="text"
              size="small"
              id="outlined-controlled"
              label={` Full Name`}
              placeholder="Search for Full Name"
              className="mt-4"
              value={query?.name}
              onChange={(event) => {
                setQuery({ ...query, name: event.target.value });
              }}
            />
            <TextField
              type="number"
              size="small"
              id="outlined-controlled"
              label={`Phone Number`}
              placeholder="Search for Phone Number"
              className="mt-4"
              value={query?.phoneNumber}
              onChange={(event) => {
                setQuery({ ...query, phoneNumber: event.target.value });
              }}
            />

            <Button
              variant="outline"
              onClick={() => {
                handleApplyFilter(limit, offset, query);
              }}
              style={{ padding: "8px 23px" }}
              className="bg-black text-white hover:bg-gray-800 flex items-center rounded "
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setQuery({
                  name: "",
                  phoneNumber: "",
                });
                callAPI(10, 0);
                setLimit(10);
                setOffset(0);
              }}
              style={{ padding: "8px 23px" }}
              className="bg-orange-600 text-white hover:bg-orange-800 flex items-center rounded "
            >
              <BookmarkX className="w-4 h-4 mr-2" />
              Clear
            </Button>
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
              className="bg-black text-white hover:bg-gray-800 flex items-center rounded "
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filter
            </Button>
          </div>
        )}

        <div className="flex justify-center md:justify-end mt-10 mr-4">
          <Button
            variant="outline"
            onClick={() => navigate("/add-venue")}
            className="bg-black text-nowrap text-white hover:bg-gray-800 flex items-center px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Venue
          </Button>
        </div>
      </div>
      <div className="p-4 table-responsive" style={{}}>
        <CustomTableContainer
          rows={userDetails}
          columns={columns}
          limit={limit}
          offset={offset}
          total={totalPages}
          setOffset={setOffset}
          setLimit={setLimit}
        />
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

      {editModal && (
        <EditVenue
          open={editModal}
          setOpen={setEditModal}
          handleCallBackApi={handleCallBackVenueApi}
          selectedVenue={singleData}
        />
      )}
    </div>
  );
};

export default VenueList;
