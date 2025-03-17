import React, { useCallback, useContext, useEffect, useState } from "react";
import { getAllRating, getAllUserReport } from "../../Libs/api";
import { toast } from "react-toastify";
import CustomTableContainer from "../../Component/CustomTableContainer";
import Loader from "../../Component/Loader";
import { MyContext } from "../../hooks/MyContextProvider";
import { set } from "date-fns";
import { TextField } from "@mui/material";
import { Filter, BookmarkX } from "lucide-react";
import { Button } from "reactstrap";
import moment from "moment";
import Box from "@mui/material/Box";
import { Drawer } from "@mui/material";
import useBreakPoints from "../../hooks/useBreakPoints";

const Rating = () => {
  const { user } = useContext(MyContext);
  const { isMobile, isTablet } = useBreakPoints();
  const [columns, setColumns] = useState([
    {
      width: 90,
      title: "Sr. No.",
      render: (cell, data, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      width: 200,
      title: "Full Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      width: 200,
      title: "Mobile Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      width: 200,
      title: "Rating",
      dataIndex: "starRating",
      key: "starRating",
    },
    {
      width: 200,
      title: "Review",
      dataIndex: "review",
      key: "review",
    },
  ]);
  const [ratingDetails, setRatingDetails] = useState([]);
  const [loading, setloading] = useState(true);
  const [limit, setLimit] = useState(10); // default slimit
  const [offset, setOffset] = useState(0); // default offset
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState({
    name: "",
    phoneNumber: "",
  });

  const callAPI = useCallback(async (limit, offset) => {
    let userid = "";
    if (user?.role !== "admin") {
      userid = user?.userid;
    }

    try {
      setloading(true);
      const apiCall = await getAllRating({ limit, offset, userid });
      if (apiCall.status) {
        setRatingDetails(apiCall.data?.rows);
        setTotalPages(apiCall?.data?.count);
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



  const handleApplyFilter = async (limit, offset, query) => {
    let userid = "";
    if (user?.role !== "admin") {
      userid = user?.userid;
    }

    try {
      setloading(true);
      const apiCall = await getAllRating({
        limit,
        offset,
        userid,
        name: query?.name,
        phoneNumber: query?.phoneNumber,
      });
      if (apiCall.status) {
        setRatingDetails(apiCall.data?.rows);
        setTotalPages(apiCall?.data?.count);
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

  useEffect(() => {
    if (user?.role === "admin") {
      setColumns([
        {
          width: 90,
          title: "Sr. No.",
          render: (cell, data, index) => {
            return <span>{index + 1}</span>;
          },
        },
        {
          width: 90,
          title: "Venue Name",
          render: (cell, data, index) => {
            return <span>{cell?.venue?.name}</span>;
          },
        },
        {
          width: 200,
          title: "Full Name",
          dataIndex: "userName",
          key: "userName",
        },
        {
          width: 200,
          title: "Mobile Number",
          dataIndex: "phoneNumber",
          key: "phoneNumber",
        },
        {
          width: 200,
          title: "Rating",
          dataIndex: "starRating",
          key: "starRating",
        },
        {
          width: 200,
          title: "Review",
          dataIndex: "review",
          key: "review",
        },
      ])

    }
  },[])

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
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
        <div className="flex justify-end mt-10 pr-4">
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

      <div className="p-4 table-responsive" style={{}}>
        <CustomTableContainer
          rows={ratingDetails}
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
    </div>
  );
};

export default Rating;
