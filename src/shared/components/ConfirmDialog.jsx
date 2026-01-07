import {
  Avatar,
  Breakpoint,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  PaperProps,
  Typography,
} from "@mui/material";
import React from "react";
import images from "../../assets/images";

// interface IDialogFormProps {
//   scroll?: "body" | "paper";
//   maxWidth?: Breakpoint | false;
//   openDialog: boolean;
//   title?: string;
//   cancelButtonText?: string;
//   confirmButtonText?: string;
//   className?: string;
//   message?: React.ReactNode;
//   paperProps?: Partial<PaperProps>;
//   handleDialogClose: () => void;
//   handleDialogAction: () => void;
// }

const ConfirmDialog = ({
  scroll,
  maxWidth,
  openDialog,
  handleDialogClose,
  handleDialogAction,
  title,
  className,
  message,
  paperProps,
  cancelButtonText,
  confirmButtonText,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleDialogClose();
        }
      }}
      className={`${className}`}
      scroll={scroll}
      maxWidth={maxWidth}
      PaperProps={paperProps}
    >
      {title && (
        <DialogTitle>
          {/* <Typography>{title}</Typography> */}
          {title}
          <IconButton
            size="small"
            className="close-action"
            onClick={handleDialogClose}
          >
            <Avatar sx={{ width: 22, height: 22 }} src={images.CloseWhite} />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent style={{ backgroundColor: "#FFF" }}>
        <DialogContentText className="px-2" id="alert-dialog-description">
          <Typography>{message}</Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDialogClose} variant="outlined">
          {cancelButtonText}
        </Button>
        <Button onClick={handleDialogAction} variant="contained" autoFocus>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
