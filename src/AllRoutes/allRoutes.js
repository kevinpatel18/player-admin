import LiveBooking from "../Pages/LiveBooking/LiveBooking";
import Login from "../Pages/Login/Login";
import ManagePayment from "../Pages/Payment/ManagePayment";
import Rating from "../Pages/Rating/Rating";
import RevenueSummary from "../Pages/RevenueSummary/RevenueSummary";
import ManageUser from "../Pages/User/ManageUser";
import AddVenue from "../Pages/Venue/AddVenue";
import CourtBookingCalendar from "../Pages/Venue/CourtBookingCalendar";
import VenueList from "../Pages/Venue/VenueList";

const publicRoutes = [{ path: "/login", component: <Login /> }];

const protectedRoutes = [
  {
    path: "/venue-configruation",
    exact: true,
    component: <CourtBookingCalendar />,
  },
  {
    path: "/",
    exact: true,
    component: <CourtBookingCalendar />,
  },
  {
    path: "/revenue-analysis",
    exact: true,
    component: <RevenueSummary />,
  },
  {
    path: "/user",
    exact: true,
    component: <ManageUser />,
  },
  {
    path: "/payment-management",
    exact: true,
    component: <ManagePayment />,
  },
  {
    path: "/real-time-booking-list",
    exact: true,
    component: <LiveBooking />,
  },
  {
    path: "/manage-venue",
    exact: true,
    component: <VenueList />,
  },
  {
    path: "/add-venue",
    exact: true,
    component: <AddVenue />,
  },
  {
    path: "/rating",
    exact: true,
    component: <Rating />,
  },
];

export { protectedRoutes, publicRoutes };
