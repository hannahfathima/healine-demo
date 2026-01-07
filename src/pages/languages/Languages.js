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

const Languages = (props) => {
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
  const [languagesDataGridOptions, setLanguagesDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [language, setLanguage] = useState({ language: "" });
  const [id, setId] = useState();

  const LanguagesDataGridColumns = [
    // { field: "licence_no", headerName: "License NO", flex: 1 },
    { field: "language", headerName: "Language", flex: 1 },
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
              editLanguages(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteLanguages(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setLanguagesData(professionsList);
  }, [professionsList]);

  const setLanguagesData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        language: item.language,
        actions: "Actions",
      };
    });
    updateLanguagesDataGridOptions("rows", profDatagridRows);
  };

  const updateLanguagesDataGridOptions = (k, v) =>
    setLanguagesDataGridOptions((prev) => ({ ...prev, [k]: v }));

  // const getSpecialitiesList = useCallback(async () => {
  //   const result = await fetchList(ApiEndPoints.GET_SPECIALITIES_FOR_SELECT);
  //   if (result.status === 200) {
  //     specialitiesListSuccess(result.data);
  //   } else {
  //     specialitiesListFailed();
  //   }
  // }, []);

  // useEffect(() => {
  //   getSpecialitiesList();
  // }, [getSpecialitiesList]);

  const getLanguagesList = useCallback(async () => {
    updateLanguagesDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.LANGUAGES +
        `?page_no=${languagesDataGridOptions.page}&items_per_page=${languagesDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateLanguagesDataGridOptions("totalRows", result.data.count);
      professionsListSuccess(result.data.rows);
      updateLanguagesDataGridOptions("loading", false);
    } else {
      updateLanguagesDataGridOptions("totalRows", []);
      professionsListFailed();
      updateLanguagesDataGridOptions("loading", false);
    }
  }, [languagesDataGridOptions.page, languagesDataGridOptions.pageSize]);

  useEffect(() => {
    getLanguagesList();
  }, [getLanguagesList]);

  useEffect(() => {
    getLanguagesList();
  }, [pageNo]);

  const editLanguages = async (id) => {
    setId(id);
    setOpen(true);
    const name = languagesDataGridOptions.rows.find((item) => item.id === id);
    setLanguage({ language: name.language });
  };

  //delete room rate api
  const [openDeleteLanguagesDialog, setOpenDeleteLanguagesDialog] =
    React.useState(false);
  const handleCloseDeleteLanguagesDialog = () =>
    setOpenDeleteLanguagesDialog(false);
  const [LanguagesId, setDeletelanguagesId] = useState(0);
  const handleConfirmDeleteLanguagesAction = async () => {
    setOpenDeleteLanguagesDialog(false);
    const result = await deleteRecord(LanguagesId, ApiEndPoints.LANGUAGES);
    if (result.status === 200) {
      toast.success(result.message);
      getLanguagesList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteLanguages = (id) => {
    setDeletelanguagesId(id);
    setOpenDeleteLanguagesDialog(true);
  };

  const onSubmit = async () => {
    if (!id) {
      const result = await createRecord(language, ApiEndPoints.LANGUAGES);
      if (result.status === 200) {
        toast.success(result.message);
        getLanguagesList();
        setLanguage({ language: "" });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await updateRecord(language, id, ApiEndPoints.LANGUAGES);
      if (result.status === 200) {
        toast.success(result.message);
        setLanguage({ language: "" });
        setId();
        setOpen(false);
        getLanguagesList();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setLanguage({ language: "" });
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
        <Typography variant="h4">Languages</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Languages
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
          loading={languagesDataGridOptions.loading}
          rowCount={languagesDataGridOptions.totalRows}
          rowsPerPageOptions={languagesDataGridOptions.rowsPerPageOptions}
          rows={languagesDataGridOptions.rows}
          columns={LanguagesDataGridColumns}
          page={languagesDataGridOptions.page - 1}
          pageSize={languagesDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setLanguagesDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateLanguagesDataGridOptions("page", 1);
            updateLanguagesDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the Language?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteLanguagesDialog}
        handleDialogClose={handleCloseDeleteLanguagesDialog}
        handleDialogAction={handleConfirmDeleteLanguagesAction}
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
        <DialogTitle>{id ? "Edit Language" : " Add Language"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter Name"
            type="text"
            fullWidth
            value={id && language.language}
            variant="standard"
            onChange={(e) => setLanguage({ language: e.target.value })}
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

export default connect(mapStateToProps, mapDispatchToProps)(Languages);
