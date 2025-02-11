import LiveBooking from "../Pages/LiveBooking/LiveBooking";
import Login from "../Pages/Login/Login";
import ManagePayment from "../Pages/Payment/ManagePayment";
import RevenueSummary from "../Pages/RevenueSummary/RevenueSummary";
import ManageUser from "../Pages/User/ManageUser";
import CourtBookingCalendar from "../Pages/Venue/CourtBookingCalendar";

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
];

export { protectedRoutes, publicRoutes };
