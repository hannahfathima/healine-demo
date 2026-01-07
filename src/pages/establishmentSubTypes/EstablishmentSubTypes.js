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
import { professionsListFailed } from "../../store/reducers/professionSlice";
import { professionsListSuccess } from "../../store/reducers/professionSlice";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import FormikSelect from "../../components/Formik/FormikSelect";
import {
  establishmentTypesListFailed,
  establishmentTypesListSuccess,
  specialitiesListFailed,
  specialitiesListSuccess,
} from "../../store/reducers/commonSlice";
import Loader from "../../shared/components/Loader";
import Spinner from "../../shared/components/Spinner";
import { Field } from "formik";
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

const EstablishmentSubTypes = (props) => {
  const {
    professionsList,
    professionsListSuccess,
    professionsListFailed,
    specialitiesListSuccess,
    specialitiesListFailed,
    specialitiesList,
    establishmentTypesList,
    establishmentTypesListSuccess,
    establishmentTypesListFailed,
  } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [pageNo, setPageNo] = useState(1);
  const [
    establishmentTypesDataGridOptions,
    setEstablishmentTypesDataGridOptions,
  ] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [name, setName] = useState({ name: "" });
  const [establishmentTypeId, setEstablishmentTypeId] = useState({
    establishmentTypeId: 2,
  });
  const [id, setId] = useState();
  const getEstablishmentTypesList = useCallback(async () => {
    const result = await fetchList(
      ApiEndPoints.GET_ESTABLISHMENT_TYPES_FOR_SELECT
    );
    if (result.status === 200) {
      establishmentTypesListSuccess(result.data);
    } else {
      establishmentTypesListFailed();
    }
  }, []);
  const establishmentTypesDataGridColumns = [
    // { field: "licence_no", headerName: "License NO", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "establishmentTypeName",
      headerName: "Establishment Type Name",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {/* <CustomIconButton
            onClickAction={() => {
              handleVivew()
            }}
            arialLabel="View"
            icon={<RemoveRedEyeIcon />}
          /> */}
          <CustomIconButton
            onClickAction={() => {
              editEstablishmentTypes(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteEstablishmentTypes(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setProfessionData(professionsList);
    getEstablishmentTypesList();
  }, [professionsList, getEstablishmentTypesList]);

  const setProfessionData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        establishmentTypeName: item.establishmentTypeInfo?.name || null,
        parent_id: item.parent_id,
        actions: "Actions",
      };
    });
    updateEstablishmentTypesDataGridOptions("rows", profDatagridRows);
  };

  const updateEstablishmentTypesDataGridOptions = (k, v) =>
    setEstablishmentTypesDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getEstablishmentTypes = useCallback(async () => {
    updateEstablishmentTypesDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.ESTABLISHMENT_SUB_TYPES +
        `?page_no=${establishmentTypesDataGridOptions.page}&items_per_page=${establishmentTypesDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateEstablishmentTypesDataGridOptions("totalRows", result.data.count);
      professionsListSuccess(result.data.rows);
      updateEstablishmentTypesDataGridOptions("loading", false);
    } else {
      updateEstablishmentTypesDataGridOptions("totalRows", []);
      professionsListFailed();
      updateEstablishmentTypesDataGridOptions("loading", false);
    }
  }, [
    establishmentTypesDataGridOptions.page,
    establishmentTypesDataGridOptions.pageSize,
  ]);

  useEffect(() => {
    getEstablishmentTypes();
  }, [getEstablishmentTypes]);

  useEffect(() => {
    getEstablishmentTypes();
  }, [pageNo]);

  const editEstablishmentTypes = async (id) => {
    setId(id);
    setOpen(true);
    const name = establishmentTypesDataGridOptions.rows.find(
      (item) => item.id === id
    );
    console.log("name", name);
    setName({ name: name.name });
    setEstablishmentTypeId({ establishmentTypeId: name.parent_id });
  };

  //delete room rate api
  const [openDeleteProfessionDialog, setOpenDeleteEstablishmentTypesDialog] =
    React.useState(false);
  const handleCloseDeleteProfessionDialog = () =>
    setOpenDeleteEstablishmentTypesDialog(false);
  const [professionId, setDeleteEstablishmentTypesId] = useState(0);
  const handleConfirmDeleteProfessionAction = async () => {
    setOpenDeleteEstablishmentTypesDialog(false);
    const result = await deleteRecord(
      professionId,
      ApiEndPoints.ESTABLISHMENT_SUB_TYPES
    );
    if (result.status === 200) {
      toast.success(result.message);
      getEstablishmentTypes();
    } else {
      toast.error(result.message);
    }
  };

  const deleteEstablishmentTypes = (id) => {
    setDeleteEstablishmentTypesId(id);
    setOpenDeleteEstablishmentTypesDialog(true);
  };

  const onSubmit = async () => {
    if (!id) {
      const result = await createRecord(
        {
          name: name.name,
          establishment_type_id: establishmentTypeId.establishmentTypeId,
        },
        ApiEndPoints.ESTABLISHMENT_SUB_TYPES
      );
      if (result.status === 200) {
        toast.success(result.message);
        getEstablishmentTypes();
        setName({ name: "" });
        setEstablishmentTypeId({ establishmentTypeId: 0 });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await updateRecord(
        {
          name: name.name,
          establishment_type_id: establishmentTypeId.establishmentTypeId,
        },
        id,
        ApiEndPoints.ESTABLISHMENT_SUB_TYPES
      );
      if (result.status === 200) {
        toast.success(result.message);
        setName({ name: "" });
        setEstablishmentTypeId({ establishmentTypeId: 0 });
        setId();
        setOpen(false);
        getEstablishmentTypes();
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
        <Typography variant="h4">Establishment Sub Types</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Establishment Sub Type
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
          loading={establishmentTypesDataGridOptions.loading}
          rowCount={establishmentTypesDataGridOptions.totalRows}
          rowsPerPageOptions={
            establishmentTypesDataGridOptions.rowsPerPageOptions
          }
          rows={establishmentTypesDataGridOptions.rows}
          columns={establishmentTypesDataGridColumns}
          page={establishmentTypesDataGridOptions.page - 1}
          pageSize={establishmentTypesDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setEstablishmentTypesDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateEstablishmentTypesDataGridOptions("page", 1);
            updateEstablishmentTypesDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the Establishment Sub Type?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteProfessionDialog}
        handleDialogClose={handleCloseDeleteProfessionDialog}
        handleDialogAction={handleConfirmDeleteProfessionAction}
      />
      {/* datatable end */}

      {/* Vive Dialog */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"View Establishment Types"}
        </DialogTitle>
        <DialogContent>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td><Typography variant="h6"> {'Name :'}</Typography></td>
                <td> {'User Name'}</td>
              </tr>
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {id ? "Edit Establishment Sub Type" : " Add Establishment Sub Type"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter Name"
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
            label="Select Establishment Type"
            defaultValue={id && establishmentTypeId.establishmentTypeId}
            fullWidth
            // value={id && name.name}
            variant="standard"
            onChange={(e) =>
              setEstablishmentTypeId({ establishmentTypeId: e.target.value })
            }
          >
            {establishmentTypesList.map((option) => (
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
  professionsList: state.profession.professionsList,
  specialitiesList: state.common.specialitiesList,
  establishmentTypesList: state.common.establishmentTypesList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    establishmentTypesListSuccess: (data) =>
      dispatch(establishmentTypesListSuccess(data)),
    establishmentTypesListFailed: () =>
      dispatch(establishmentTypesListFailed()),
    professionsListSuccess: (data) => dispatch(professionsListSuccess(data)),
    professionsListFailed: () => dispatch(professionsListFailed()),
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EstablishmentSubTypes);
