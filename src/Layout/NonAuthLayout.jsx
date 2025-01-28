import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MyContext } from "../hooks/MyContextProvider";

const NonAuthLayout = (props) => {
  const { token } = useContext(MyContext);

  if (token) {
    return <Navigate to="/venue-configruation" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuthLayout;
