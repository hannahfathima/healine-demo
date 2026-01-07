import { CircularProgress } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <div
      id="loader"
      className="loader-wrapper"
      style={{ display: "none", visibility: "hidden" }}
    >
      <CircularProgress color="primary" thickness={3} size={44} />
    </div>
  );
};

export default Loader;
