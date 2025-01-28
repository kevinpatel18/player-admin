import React from "react";
import { protectedRoutes, publicRoutes } from "./allRoutes";
import { Routes, Route } from "react-router-dom";
import { AuthProtected } from "./AuthProtected"; 
import NonAuthLayout from "../Layout/NonAuthLayout";

const Index = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<NonAuthLayout />}>
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} element={route.component} key={idx} />
        ))}
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthProtected />}>
        {protectedRoutes.map((route, idx) => (
          <Route path={route.path} element={route.component} key={idx} />
        ))}
      </Route>
    </Routes>
  );
};

export default Index;
