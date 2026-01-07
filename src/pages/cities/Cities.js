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
  zonesListFailed,
  zonesListSuccess,
} from "../../store/reducers/commonSlice";
import Loader from "../../shared/components/Loader";
import Spinner from "../../shared/components/Spinner";
import {
  cityListFailed,
  cityListSuccess,
} from "../../store/reducers/citySlice";
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

const Cities = (props) => {
  const {
    cityList,
    cityListSuccess,
    cityListFailed,
    zonesListSuccess,
    zonesListFailed,
    zonesList,
  } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const getCitiesListFromServer = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_ZONES_FOR_SELECT);
    if (result.status === 200) {
      zonesListSuccess(result.data);
    } else {
      zonesListFailed();
    }
  }, []);
  const [pageNo, setPageNo] = useState(1);
  const [cityDataGridOptions, setCityDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [name, setName] = useState({ name: "" });
  const [zoneId, setZoneId] = useState({
    zoneId: 0,
  });
  const [id, setId] = useState();

  const cityDataGridColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "zone", headerName: "Zone", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              editCity(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteCity(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setCityData(cityList);
    getCitiesListFromServer();
  }, [cityList, getCitiesListFromServer]);

  const setCityData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        zone: item?.zoneInfo?.name || "",
        zone_id: item?.zoneInfo?.id || 0,
        actions: "Actions",
      };
    });
    updateCityDataGridOptions("rows", profDatagridRows);
  };

  const updateCityDataGridOptions = (k, v) =>
    setCityDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getCitiesList = useCallback(async () => {
    updateCityDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.CITIES_RESOURCE_ROUTE +
        `?page_no=${cityDataGridOptions.page}&items_per_page=${cityDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateCityDataGridOptions("totalRows", result.data.count);
      cityListSuccess(result.data.rows);
      updateCityDataGridOptions("loading", false);
    } else {
      updateCityDataGridOptions("totalRows", []);
      cityListFailed();
      updateCityDataGridOptions("loading", false);
    }
  }, [cityDataGridOptions.page, cityDataGridOptions.pageSize]);

  useEffect(() => {
    getCitiesList();
  }, [getCitiesList]);

  useEffect(() => {
    getCitiesList();
  }, [pageNo]);

  const editCity = async (id) => {
    setId(id);
    setOpen(true);
    const name = cityDataGridOptions.rows.find((item) => item.id === id);
    setName({ name: name.name });
    console.log("name name", name);
    setZoneId({ zoneId: name.zone_id });
  };

  //delete room rate api
  const [openDeleteCityDialog, setOpenDeleteCityDialog] = React.useState(false);
  const handleCloseDeleteCityDialog = () => setOpenDeleteCityDialog(false);
  const [cityId, setDeleteCityId] = useState(0);
  const handleConfirmDeleteCityAction = async () => {
    setOpenDeleteCityDialog(false);
    const result = await deleteRecord(
      cityId,
      ApiEndPoints.CITIES_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getCitiesList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteCity = (id) => {
    setDeleteCityId(id);
    setOpenDeleteCityDialog(true);
  };

  const onSubmit = async () => {
    if (!id) {
      if (!name.name || name.name == "") {
        toast.error("Name is required.");
        return;
      }
      if (!zoneId.zoneId || zoneId.zoneId == 0) {
        toast.error("Zone is required.");
        return;
      }
      const result = await createRecord(
        {
          name: name.name,
          zone_id: zoneId.zoneId,
        },
        ApiEndPoints.CITIES_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        toast.success(result.message);
        getCitiesList();
        setName({ name: "" });
        setZoneId({ zoneId: 0 });
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
        {
          name: name.name,
          zone_id: zoneId.zoneId,
        },
        id,
        ApiEndPoints.CITIES_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        toast.success(result.message);
        setName({ name: "" });
        setZoneId({ zoneId: 0 });
        setId();
        setOpen(false);
        getCitiesList();
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
        <Typography variant="h4">Cities</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add City
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
          loading={cityDataGridOptions.loading}
          rowCount={cityDataGridOptions.totalRows}
          rowsPerPageOptions={cityDataGridOptions.rowsPerPageOptions}
          rows={cityDataGridOptions.rows}
          columns={cityDataGridColumns}
          page={cityDataGridOptions.page - 1}
          pageSize={cityDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setCityDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateCityDataGridOptions("page", 1);
            updateCityDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the city?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteCityDialog}
        handleDialogClose={handleCloseDeleteCityDialog}
        handleDialogAction={handleConfirmDeleteCityAction}
      />
      {/* datatable end */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{id ? "Edit City" : " Add City"}</DialogTitle>
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
            City Name <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter city name"
            type="text"
            fullWidth
            value={id && name.name}
            variant="standard"
            onChange={(e) => setName({ name: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            id="name"
            label="Select zone"
            defaultValue={id && zoneId.zoneId}
            fullWidth
            // value={id && name.name}
            variant="standard"
            onChange={(e) => setZoneId({ zoneId: e.target.value })}
          >
            {zonesList?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
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
  cityList: state.city.cityList,
  zonesList: state.common.zonesList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    cityListSuccess: (data) => dispatch(cityListSuccess(data)),
    cityListFailed: () => dispatch(cityListFailed()),
    zonesListSuccess: (data) => dispatch(zonesListSuccess(data)),
    zonesListFailed: () => dispatch(zonesListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cities);
