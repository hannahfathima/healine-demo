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
import { createRecord, deleteRecord, fetchList, updateRecord } from "../../apis/services/CommonApiService";
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
  specialitiesListFailed,
  specialitiesListSuccess,
} from "../../store/reducers/commonSlice";
import Loader from "../../shared/components/Loader";
import Spinner from "../../shared/components/Spinner";
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

const ProfessionTypes = (props) => {
  const {
    professionsList,
    professionsListSuccess,
    professionsListFailed,
    specialitiesListSuccess,
    specialitiesListFailed,
    specialitiesList,
  } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [pageNo, setPageNo] = useState(1);
  const [professionTypesDataGridOptions, setProfessionTypesDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [name, setName] = useState({ name: '' })
  const [id, setId] = useState()

  const professionDataGridColumns = [
    // { field: "licence_no", headerName: "License NO", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: 'Actions',
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
              editProfessionTypes(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteProfessionTypes(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setProfessionTypesData(professionsList);
  }, [professionsList]);

  const setProfessionTypesData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        actions: "Actions",
      };
    });
    updateProfessionTypesDataGridOptions("rows", profDatagridRows);
  };

  const updateProfessionTypesDataGridOptions = (k, v) =>
    setProfessionTypesDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getProfessionTypesList = useCallback(async () => {
    updateProfessionTypesDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.PROFESSION_TYPES +
      `?page_no=${professionTypesDataGridOptions.page}&items_per_page=${professionTypesDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateProfessionTypesDataGridOptions("totalRows", result.data.count);
      professionsListSuccess(result.data.rows);
      updateProfessionTypesDataGridOptions("loading", false);
    } else {
      updateProfessionTypesDataGridOptions("totalRows", []);
      professionsListFailed();
      updateProfessionTypesDataGridOptions("loading", false);
    }
  }, [
    professionTypesDataGridOptions.page,
    professionTypesDataGridOptions.pageSize,
  ]);

  useEffect(() => {
    getProfessionTypesList();
  }, [getProfessionTypesList]);

  useEffect(() => {
    getProfessionTypesList();
  }, [pageNo]);

  const editProfessionTypes = async (id) => {
    setId(id)
    setOpen(true)
    const name = professionTypesDataGridOptions.rows.find((item)=>item.id === id)
   setName({name:name.name} );
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
      ApiEndPoints.PROFESSION_TYPES
    );
    if (result.status === 200) {
      toast.success(result.message);
      getProfessionTypesList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteProfessionTypes = (id) => {
    setDeleteProfessionTypesId(id);
    setOpenDeleteProfessionTypesDialog(true);
  };

  const onSubmit = async () => {
    if (!id) {
      const result = await createRecord(
        name,
        ApiEndPoints.PROFESSION_TYPES
      );
      if (result.status === 200) {
        toast.success(result.message);
        getProfessionTypesList();
        setName({ name: '' });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await updateRecord(
        name,
        id,
        ApiEndPoints.PROFESSION_TYPES
      );
      if (result.status === 200) {
        toast.success(result.message);
        setName({ name: '' });
        setId();
        setOpen(false);
        getProfessionTypesList();
      } else {
        toast.error(result.message);
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
    setName({ name: '' });
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
        <Typography variant="h4">Profession Types</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Profession Types
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
          loading={professionTypesDataGridOptions.loading}
          rowCount={professionTypesDataGridOptions.totalRows}
          rowsPerPageOptions={professionTypesDataGridOptions.rowsPerPageOptions}
          rows={professionTypesDataGridOptions.rows}
          columns={professionDataGridColumns}
          page={professionTypesDataGridOptions.page - 1}
          pageSize={professionTypesDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setProfessionTypesDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateProfessionTypesDataGridOptions("page", 1);
            updateProfessionTypesDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the Profession Types?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteProfessionTypesDialog}
        handleDialogClose={handleCloseDeleteProfessionTypesDialog}
        handleDialogAction={handleConfirmDeleteProfessionTypesAction}
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
        <DialogTitle>{id ? 'Edit Profession Types' : ' Add Profession Types'}</DialogTitle>
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
              onSubmit()
            }}
            color="primary"
            style={{
              justifyContent: "center",
              width: "98px",
              height: "44px",
              textTransform: "capitalize",
              background:
                "linear-gradient(180deg, #255480 0%, #173450 100%)",
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
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    professionsListSuccess: (data) => dispatch(professionsListSuccess(data)),
    professionsListFailed: () => dispatch(professionsListFailed()),
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionTypes);
