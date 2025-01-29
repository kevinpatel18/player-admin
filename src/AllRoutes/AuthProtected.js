import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MyContext } from "../hooks/MyContextProvider";
import Header from "../Layout/Header";
import useBreakPoints from "../hooks/useBreakPoints";
import MobileNavbar from "../Layout/MobileNavbar";

const AuthProtected = () => {
  const { isTablet } = useBreakPoints();
  const { token } = useContext(MyContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  console.log(token, "token");

  // Render child routes here using Outlet
  return (
    <div id="layout-wrapper">
      <Header />
      <Outlet />
      <div className="mt-14">{isTablet && <MobileNavbar />}</div>
    </div>
  );
};

const AccessRoute = ({ component: Component }) => {
  // Render the passed component as a JSX element
  return <>{Component}</>;
};

export { AuthProtected, AccessRoute };
