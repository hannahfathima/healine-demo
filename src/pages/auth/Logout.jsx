import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Storage from "../../utils/HandelLocalStorage";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); // show dialog when component mounts

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // go back if cancel
  };

  const handleConfirm = () => {
    Storage.clearItem("userDetails");
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to logout?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Logout;
