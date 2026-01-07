import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Input, Uploader } from "rsuite";
import { Table } from "rsuite";
import {
  DialogContentText,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useDeprecatedAnimatedState } from "framer-motion";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useState } from "react";
import { rowsPerPageJsonData, specialitiesData } from "../../utils/jsonData";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useCallback } from "react";
import {
  createRecord,
  deleteRecord,
  fetchList,
  updateRecord,
} from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";

import { connect } from "react-redux";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import FormikSelect from "../../components/Formik/FormikSelect";
import {
  specialitiesListFailed,
  specialitiesListSuccess,
} from "../../store/reducers/commonSlice";
import Loader from "../../shared/components/Loader";
import Spinner from "../../shared/components/Spinner";
import {
  zoneListFailed,
  zoneListSuccess,
} from "../../store/reducers/zoneSlice";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Zones = (props) => {
  const { zoneList, zoneListSuccess, zoneListFailed } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [pageNo, setPageNo] = useState(1);
  const [zoneDataGridOptions, setZoneDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [name, setName] = useState({ name: "" });
  const [id, setId] = useState();

  const zoneDataGridColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              editZone(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteBanner(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setZoneData(zoneList);
  }, [zoneList]);

  const setZoneData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        actions: "Actions",
      };
    });
    updateZoneDataGridOptions("rows", profDatagridRows);
  };

  const updateZoneDataGridOptions = (k, v) =>
    setZoneDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getZonesList = useCallback(async () => {
    updateZoneDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.ZONES_RESOURCE_ROUTE +
        `?page_no=${zoneDataGridOptions.page}&items_per_page=${zoneDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateZoneDataGridOptions("totalRows", result.data.count);
      zoneListSuccess(result.data.rows);
      updateZoneDataGridOptions("loading", false);
    } else {
      updateZoneDataGridOptions("totalRows", []);
      zoneListFailed();
      updateZoneDataGridOptions("loading", false);
    }
  }, [zoneDataGridOptions.page, zoneDataGridOptions.pageSize]);

  useEffect(() => {
    getZonesList();
  }, [getZonesList]);

  useEffect(() => {
    getZonesList();
  }, [pageNo]);

  const editZone = async (id) => {
    setId(id);
    setOpen(true);
    const name = zoneDataGridOptions.rows.find((item) => item.id === id);
    setName({ name: name.name });
  };

  //delete room rate api
  const [openDeleteZoneDialog, setOpenDeleteZoneDialog] = React.useState(false);
  const handleCloseDeleteZoneDialog = () => setOpenDeleteZoneDialog(false);
  const [zoneId, setDeleteZoneId] = useState(0);
  const handleConfirmDeleteZoneAction = async () => {
    setOpenDeleteZoneDialog(false);
    const result = await deleteRecord(
      zoneId,
      ApiEndPoints.ZONES_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getZonesList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteBanner = (id) => {
    setDeleteZoneId(id);
    setOpenDeleteZoneDialog(true);
  };

  const onSubmit = async () => {
    if (!id) {
      if (!name.name || name.name == "") {
        toast.error("Name is required.");
        return;
      }
      const result = await createRecord(
        name,
        ApiEndPoints.ZONES_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        toast.success(result.message);
        getZonesList();
        setName({ name: "" });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
      if (!name.name || name.name == "") {
        toast.error("Name is required.");
        return;
      }
      const result = await updateRecord(
        name,
        id,
        ApiEndPoints.ZONES_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        toast.success(result.message);
        setName({ name: "" });
        setId();
        setOpen(false);
        getZonesList();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName({ name: "" });
    setId();
  };

  return (
    <div className="min-width">
      {/* <Spinner /> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4">Zones</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Zone
        </Button>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      {/* datatable start */}
      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={zoneDataGridOptions.loading}
          rowCount={zoneDataGridOptions.totalRows}
          rowsPerPageOptions={zoneDataGridOptions.rowsPerPageOptions}
          rows={zoneDataGridOptions.rows}
          columns={zoneDataGridColumns}
          page={zoneDataGridOptions.page - 1}
          pageSize={zoneDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setZoneDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateZoneDataGridOptions("page", 1);
            updateZoneDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the zone?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteZoneDialog}
        handleDialogClose={handleCloseDeleteZoneDialog}
        handleDialogAction={handleConfirmDeleteZoneAction}
      />
      {/* datatable end */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{id ? "Edit Zone" : " Add Zone"}</DialogTitle>
        <DialogContent>
          <Typography
            style={{
              marginBottom: "0px",
              color: "rgb(30, 30, 30)",
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: "500",
            }}
          >
            Zone Name <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter zone name"
            type="text"
            fullWidth
            value={id && name.name}
            variant="standard"
            onChange={(e) => setName({ name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            className="mt-1"
            size="large"
            variant="contained"
            disableElevation
            type="submit"
            onClick={() => {
              onSubmit();
            }}
            color="primary"
            style={{
              justifyContent: "center",
              width: "98px",
              height: "44px",
              textTransform: "capitalize",
              background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  zoneList: state.zone.zoneList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    zoneListSuccess: (data) => dispatch(zoneListSuccess(data)),
    zoneListFailed: () => dispatch(zoneListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Zones);
