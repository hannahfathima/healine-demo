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
// import { styled } from "@mui/material/styles";

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
const StyledUploaderWrapper = styled('div')(({ theme }) => ({
  '& .rs-uploader-picture .rs-uploader-file-item-preview img': {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
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

const Facilities = (props) => {
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
  const [FacilitiesDataGridOptions, setFacilitiesDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [name, setName] = useState({ name: '', description: '', icon: null }); const [id, setId] = useState()

  const professionDataGridColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      renderCell: (params) => (
        <img src={params.value} alt="icon" style={{ width: 30, height: 30 }} />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              editFacilities(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteFacilities(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setFacilitiesData(professionsList);
  }, [professionsList]);

  const setFacilitiesData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description || 'N/A',
        icon: item.icon,
        actions: "Actions",
      };
    });
    updateFacilitiesDataGridOptions("rows", profDatagridRows);
  };

  const updateFacilitiesDataGridOptions = (k, v) =>
    setFacilitiesDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getFacilitiesList = useCallback(async () => {
    updateFacilitiesDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.FACILITIES +
      `?page_no=${FacilitiesDataGridOptions.page}&items_per_page=${FacilitiesDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateFacilitiesDataGridOptions("totalRows", result.data.count);
      professionsListSuccess(result.data.rows);
      updateFacilitiesDataGridOptions("loading", false);
    } else {
      updateFacilitiesDataGridOptions("totalRows", []);
      professionsListFailed();
      updateFacilitiesDataGridOptions("loading", false);
    }
  }, [
    FacilitiesDataGridOptions.page,
    FacilitiesDataGridOptions.pageSize,
  ]);

  useEffect(() => {
    getFacilitiesList();
  }, [getFacilitiesList]);

  useEffect(() => {
    getFacilitiesList();
  }, [pageNo]);

  const editFacilities = async (id) => {
    setId(id);
    setOpen(true);
    const facility = FacilitiesDataGridOptions.rows.find((item) => item.id === id);
    setName({
      name: facility.name,
      description: facility.description || '',
      icon: facility.icon || null,
    });
  };

  //delete room rate api
  const [openDeleteFacilitiesDialog, setOpenDeleteFacilitiesDialog] =
    React.useState(false);
  const handleCloseDeleteFacilitiesDialog = () =>
    setOpenDeleteFacilitiesDialog(false);
  const [FacilitiesId, setDeleteFacilitiesId] = useState(0);
  const handleConfirmDeleteProfessionAction = async () => {
    setOpenDeleteFacilitiesDialog(false);
    const result = await deleteRecord(
      FacilitiesId,
      ApiEndPoints.FACILITIES
    );
    if (result.status === 200) {
      toast.success(result.message);
      getFacilitiesList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteFacilities = (id) => {
    setDeleteFacilitiesId(id);
    setOpenDeleteFacilitiesDialog(true);
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name.name);
    formData.append('description', name.description);
    if (name.icon) {
      formData.append('icon', name.icon);
    }

    if (!id) {
      const result = await createRecord(
        formData,
        ApiEndPoints.FACILITIES
      );
      if (result.status === 200) {
        toast.success(result.message);
        getFacilitiesList();
        setName({ name: '', description: '', icon: null });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await updateRecord(
        formData,
        id,
        ApiEndPoints.FACILITIES
      );
      if (result.status === 200) {
        toast.success(result.message);
        setName({ name: '', description: '', icon: null });
        setId();
        setOpen(false);
        getFacilitiesList();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName({ name: '', description: '', icon: null });
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
        <Typography variant="h4">Facilities</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Facilities
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
          loading={FacilitiesDataGridOptions.loading}
          rowCount={FacilitiesDataGridOptions.totalRows}
          rowsPerPageOptions={FacilitiesDataGridOptions.rowsPerPageOptions}
          rows={FacilitiesDataGridOptions.rows}
          columns={professionDataGridColumns}
          page={FacilitiesDataGridOptions.page - 1}
          pageSize={FacilitiesDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setFacilitiesDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateFacilitiesDataGridOptions("page", 1);
            updateFacilitiesDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the Facilities?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteFacilitiesDialog}
        handleDialogClose={handleCloseDeleteFacilitiesDialog}
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
        <DialogTitle>{id ? 'Edit Facilities' : ' Add Facilities'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter Name"
            type="text"
            fullWidth
            value={name.name}
            variant="standard"
            onChange={(e) => setName({ ...name, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="description"
            label="Enter Description"
            type="text"
            fullWidth
            value={name.description}
            variant="standard"
            onChange={(e) => setName({ ...name, description: e.target.value })}
          />
          {/* // Update Uploader component to allow only one file */}
          <StyledUploaderWrapper>
            <Uploader
              autoUpload={false}
              fileList={name.icon ? [{ name: 'icon', url: name.icon }] : []}
              onChange={(fileList) => {
                const file = fileList.length > 0 ? fileList[fileList.length - 1].blobFile : null;
                setName({ ...name, icon: file });
              }}
              accept="image/*"
              listType="picture"
              multiple={false}
            >
  
            </Uploader>
          </StyledUploaderWrapper>
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

export default connect(mapStateToProps, mapDispatchToProps)(Facilities);
