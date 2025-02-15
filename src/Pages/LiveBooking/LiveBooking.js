import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MyContext } from "../../hooks/MyContextProvider";
import useBreakPoints from "../../hooks/useBreakPoints";
import { useLocation } from "react-router-dom";
import CustomTableContainer from "../../Component/CustomTableContainer";
import moment from "moment";

const LiveBooking = () => {
  const [allBookingDetails, setAllBookingDetails] = useState([]);
  const [totalPages, setTotalPages] = useState();
  console.log("totalPages: ", totalPages);
  console.log("allBookingDetails: ", allBookingDetails);
  const [wsConnected, setWsConnected] = useState(false);
  const [limit, setLimit] = useState(10); // default slimit
  const [offset, setOffset] = useState(0); // default offset
  console.log("offset: ", offset);

  const wsRef = useRef(null);
  const location = useLocation();
  const reconnectTimeoutRef = useRef(null);

  console.log("allBookingDetails: ", allBookingDetails);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    const socket = new WebSocket(
      "wss://pllayer-backend-68514470993.us-central1.run.app"
    );

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
      if (response.type === "venueBookingReport") {
        if (response.status) {
          setAllBookingDetails(response?.data?.rows);
          setTotalPages(response?.data?.count);
          console.log("response: ", response);
        } else {
          console.error("Error:", response.message);
        }
      }
      if (response.type === "reloadPage") {
        console.log("Reload page event received");
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
  }, []);

  // Separate function to get booking data

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
      sendWebSocketMessage("venueBookingReport", params);
    },
    [sendWebSocketMessage]
  );

  useEffect(() => {
    const formData = {
      size: limit,
      page: offset,
    };
    getAllBookingSlotsWebSocket(formData);
  }, [limit, offset]);
  useEffect(() => {
    const socket = connectWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Close WebSocket when route changes
        console.log("WebSocket disconnected due to route change");
      }
    };
  }, [location?.pathname]);

  const columns = [
    {
      width: 90,
      title: "Sr. No.",
      render: (cell, data, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      width: 200,
      title: "Date",
      render: (cell) => {
        console.log(cell);
        return (
          <span>
            {cell?.createdAt
              ? moment(cell?.createdAt).format("DD-MM-YYYY")
              : ""}
          </span>
        );
      },
      key: "username",
    },
    {
      width: 200,
      title: "Booking Date",
      render: (cell) => {
        console.log(cell);
        return (
          <span>
            {cell?.date
              ? moment(cell?.date, "YYYY-MM-DD").format("DD-MM-YYYY")
              : ""}
          </span>
        );
      },
      key: "username",
    },
    {
      width: 200,
      title: "Sport",
      render: (cell) => {
        return <span>{cell?.venueSport?.name || ""}</span>;
      },
    },
    {
      width: 200,
      title: "Venue",
      render: (cell) => {
        return <span>{cell?.venue?.name || ""}</span>;
      },
    },
    {
      width: 200,
      title: "Venue Court",
      render: (cell) => {
        return <span>{cell?.venueCourt?.courtName || ""}</span>;
      },
    },
    {
      width: 200,
      title: "User Name",
      render: (cell) => {
        return <span>{cell?.users?.username || ""}</span>;
      },
    },
    {
      width: 200,
      title: "Mobile Number",
      render: (cell) => {
        return <span>{cell?.users?.phoneNumber || ""}</span>;
      },
      key: "user.phoneNumber",
    },
  ];
  return (
    <div className="p-4 table-responsive" style={{}}>
      <CustomTableContainer
        rows={allBookingDetails}
        columns={columns}
        limit={limit}
        offset={offset}
        total={+totalPages}
        setOffset={setOffset}
        setLimit={setLimit}
      />
    </div>
  );
};

export default LiveBooking;
