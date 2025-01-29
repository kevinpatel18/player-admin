import Login from "../Pages/Login/Login";
import RevenueSummary from "../Pages/RevenueSummary/RevenueSummary";
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
];

export { protectedRoutes, publicRoutes };
