import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  circularProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const Spinner = ({ color = "primary" }) => {
  const classes = useStyles();
  return (
    <div 
      className="loader-wrapper" 
      style={{ 
        position: "relative",  // Ensure it stays within main content
        minHeight: "200px",    // Prevent layout shift
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <CircularProgress className={classes.circularProgress} color={color} thickness={2} size={50} />
    </div>
  );
};

export default Spinner;