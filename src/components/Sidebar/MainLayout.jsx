import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "./SideBar";

const MainLayout = ({ children }) => {
  // let auth = { token: true };
  const auth = useSelector((state) => state.auth);
  // const auth = localStorage.getItem("access_token");
  // console.log("Auth form main layout", auth.userToken);
  const user = localStorage.getItem("userDetails");
  // return auth?.userToken ? (
  return user ? (
    <div className="wrapper">
      <SideBar>
        {children}
      </SideBar>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default MainLayout;