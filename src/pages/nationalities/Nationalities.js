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
  nationalityListFailed,
  nationalityListSuccess,
} from "../../store/reducers/nationalitySlice";
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

const Nationalities = (props) => {
  const { nationalityList, nationalityListSuccess, nationalityListFailed } =
    props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [pageNo, setPageNo] = useState(1);
  const [nationalitiesDataGridOptions, setNationalityDataGridOptions] =
    useState({
      loading: false,
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: rowsPerPageJsonData,
      pageSize: 10,
      page: 1,
    });
  const [name, setName] = useState({ name: "" });
  const [image, setImage] = useState({ image: "" });
  const [id, setId] = useState();

  const nationalityDataGridColumns = [
    {
      field: "image",
      headerName: "Icon",
      flex: 1,
      renderCell: (params) => (
        <>
          {params.value ? (
            <img
              style={{ width: "50px", height: "50px" }}
              src={params.value}
              alt={params.row.link_url}
            />
          ) : null}
        </>
      ),
    },
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
              editNationalities(params.id);
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
    setNationalityData(nationalityList);
  }, [nationalityList]);

  const setNationalityData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        image: item.icon,
        actions: "Actions",
      };
    });
    updateNationalityDataGridOptions("rows", profDatagridRows);
  };

  const updateNationalityDataGridOptions = (k, v) =>
    setNationalityDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getNationalitiesList = useCallback(async () => {
    updateNationalityDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.NATIONALITIES_RESOURCE_ROUTE +
        `?page_no=${nationalitiesDataGridOptions.page}&items_per_page=${nationalitiesDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateNationalityDataGridOptions("totalRows", result.data.count);
      nationalityListSuccess(result.data.rows);
      updateNationalityDataGridOptions("loading", false);
    } else {
      updateNationalityDataGridOptions("totalRows", []);
      nationalityListFailed();
      updateNationalityDataGridOptions("loading", false);
    }
  }, [
    nationalitiesDataGridOptions.page,
    nationalitiesDataGridOptions.pageSize,
  ]);

  useEffect(() => {
    getNationalitiesList();
  }, [getNationalitiesList]);

  useEffect(() => {
    getNationalitiesList();
  }, [pageNo]);

  const editNationalities = async (id) => {
    setId(id);
    setOpen(true);
    const name = nationalitiesDataGridOptions.rows.find(
      (item) => item.id === id
    );
    setName({ name: name.name });
  };

  //delete room rate api
  const [openDeleteProfessionTypesDialog, setOpenDeleteProfessionTypesDialog] =
    React.useState(false);
  const handleCloseDeleteProfessionTypesDialog = () =>
    setOpenDeleteProfessionTypesDialog(false);
  const [professionTypesId, setDeleteProfessionTypesId] = useState(0);
  const handleConfirmDeleteProfessionTypesAction = async () => {
    setOpenDeleteProfessionTypesDialog(false);
    const result = await deleteRecord(
      professionTypesId,
      ApiEndPoints.NATIONALITIES_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getNationalitiesList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteBanner = (id) => {
    setDeleteProfessionTypesId(id);
    setOpenDeleteProfessionTypesDialog(true);
  };

  const onSubmit = async () => {
    if (!id) {
      if (!name.name || name.name == "") {
        toast.error("Name is required.");
        return;
      } else if (!image.image || image.image == "") {
        toast.error("Icon is required.");
        return;
      }
      let formData = new FormData();
      formData.append("name", name.name);
      formData.append("icon", image.image);
      const result = await createRecord(
        formData,
        ApiEndPoints.NATIONALITIES_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        toast.success(result.message);
        getNationalitiesList();
        setName({ name: "" });
        setImage({ image: "" });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
      if (!name.name || name.name == "") {
        toast.error("Name is required.");
        return;
      }
      let formData = new FormData();
      formData.append("name", name.name);
      formData.append("icon", image.image);
      const result = await updateRecord(
        formData,
        id,
        ApiEndPoints.NATIONALITIES_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        toast.success(result.message);
        setName({ name: "" });
        setImage({ image: "" });
        setId();
        setOpen(false);
        getNationalitiesList();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName({ name: "" });
    setImage({ image: "" });
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
        <Typography variant="h4">Nationalities</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Nationality
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
          loading={nationalitiesDataGridOptions.loading}
          rowCount={nationalitiesDataGridOptions.totalRows}
          rowsPerPageOptions={nationalitiesDataGridOptions.rowsPerPageOptions}
          rows={nationalitiesDataGridOptions.rows}
          columns={nationalityDataGridColumns}
          page={nationalitiesDataGridOptions.page - 1}
          pageSize={nationalitiesDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setNationalityDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateNationalityDataGridOptions("page", 1);
            updateNationalityDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the nationality?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteProfessionTypesDialog}
        handleDialogClose={handleCloseDeleteProfessionTypesDialog}
        handleDialogAction={handleConfirmDeleteProfessionTypesAction}
      />
      {/* datatable end */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {id ? "Edit Nationality" : " Add Nationality"}
        </DialogTitle>
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
            Name <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter name"
            type="text"
            fullWidth
            value={id && name.name}
            variant="standard"
            onChange={(e) => setName({ name: e.target.value })}
          />
          <Typography
            style={{
              marginTop: "20px",
              marginBottom: "11px",
              color: "rgb(30, 30, 30)",
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: "500",
            }}
          >
            Icon <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="icon"
            type="file"
            // onChange={(event) => {
            //   props.setFieldValue("icon", event.currentTarget.files[0]);
            // }}
            onChange={(e) => setImage({ image: e.currentTarget.files[0] })}
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
  nationalityList: state.nationality.nationalityList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    nationalityListSuccess: (data) => dispatch(nationalityListSuccess(data)),
    nationalityListFailed: () => dispatch(nationalityListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Nationalities);
