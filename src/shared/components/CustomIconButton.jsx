import { IconButton } from "@mui/material";
import React from "react";

const CustomIconButton = ({
  onClickAction,
  arialLabel,
  icon,
  size = "small",
  disabled,
}) => {
  return (
    <IconButton
      disabled={disabled}
      aria-label={arialLabel}
      onClick={onClickAction}
      size={size}
    >
      {icon}
    </IconButton>
  );
};

export default CustomIconButton;
