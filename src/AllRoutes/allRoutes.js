import Login from "../Pages/Login/Login";
import CourtBookingCalendar from "../Pages/Venue/CourtBookingCalendar";

const publicRoutes = [{ path: "/login", component: <Login /> }];

const protectedRoutes = [
  {
    path: "/venue-configruation",
    exact: true,
    component: <CourtBookingCalendar />,
  },
];

export { protectedRoutes, publicRoutes };
