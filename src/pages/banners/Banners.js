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
  bannersListFailed,
  bannersListSuccess,
} from "../../store/reducers/bannerSlice";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const pageOptions = [
  { label: "Home", value: "home" },
  { label: "About", value: "about" },
  { label: "Contact", value: "contact" },
  { label: "Services", value: "services" },
];
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

const Banners = (props) => {
  const { bannersList, bannersListSuccess, bannersListFailed } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [pageNo, setPageNo] = useState(1);
  const [bannersDataGridOptions, setBannersDataGridOptions] = useState({
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

  const bannersDataGridColumns = [
    { field: "link_url", headerName: "Link Url", flex: 1 },
    {
      field: "image",
      headerName: "Banner",
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
      {
    field: "page",
    headerName: "Page",
    flex: 1,
  },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              editBanner(params.id);
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
    setBannersData(bannersList);
  }, [bannersList]);

  const setBannersData = (data) => {
    const profDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        link_url: item.link_url,
        image: item.image,
        page: item.page,
        actions: "Actions",
      };
    });
    updateBannersDataGridOptions("rows", profDatagridRows);
  };

  const updateBannersDataGridOptions = (k, v) =>
    setBannersDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getBannerList = useCallback(async () => {
    updateBannersDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.BANNERS +
        `?page_no=${bannersDataGridOptions.page}&items_per_page=${bannersDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateBannersDataGridOptions("totalRows", result.data.count);
      bannersListSuccess(result.data.rows);
      updateBannersDataGridOptions("loading", false);
    } else {
      updateBannersDataGridOptions("totalRows", []);
      bannersListFailed();
      updateBannersDataGridOptions("loading", false);
    }
  }, [bannersDataGridOptions.page, bannersDataGridOptions.pageSize]);

  useEffect(() => {
    getBannerList();
  }, [getBannerList]);

  useEffect(() => {
    getBannerList();
  }, [pageNo]);

  const editBanner = async (id) => {
    setId(id);
    setOpen(true);
    const name = bannersDataGridOptions.rows.find((item) => item.id === id);
    setName({ name: name.link_url });
    setPage(name.page || "");

  };

  //delete room rate api
  const [openDeleteProfessionTypesDialog, setOpenDeleteProfessionTypesDialog] =
    React.useState(false);
  const handleCloseDeleteProfessionTypesDialog = () =>
    setOpenDeleteProfessionTypesDialog(false);
  const [professionTypesId, setDeleteProfessionTypesId] = useState(0);
  const handleConfirmDeleteProfessionTypesAction = async () => {
    setOpenDeleteProfessionTypesDialog(false);
    const result = await deleteRecord(professionTypesId, ApiEndPoints.BANNERS);
    if (result.status === 200) {
      toast.success(result.message);
      getBannerList();
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
        toast.error("URL is required.");
        return;
      } else if (!image.image || image.image == "") {
        toast.error("Banner is required.");
        return;
      }
      if (!page || page === "") {
  toast.error("Page is required.");
  return;
}
      let formData = new FormData();
      formData.append("link", name.name);
      formData.append("image", image.image);
      formData.append("page", page);

      const result = await createRecord(formData, ApiEndPoints.BANNERS);
      if (result.status === 200) {
        toast.success(result.message);
        getBannerList();
        setName({ name: "" });
        setImage({ image: "" });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
      if (!name.name || name.name == "") {
        toast.error("URL is required..");
        return;
      }
      let formData = new FormData();
      formData.append("link", name.name);
      formData.append("image", image.image);
      formData.append("page", page);
      const result = await updateRecord(formData, id, ApiEndPoints.BANNERS);
      if (result.status === 200) {
        toast.success(result.message);
        setName({ name: "" });
        setImage({ image: "" });
        setId();
        setOpen(false);
        getBannerList();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName({ name: "" });
    setImage({ image: "" });
    setPage("");

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
        <Typography variant="h4">Banners</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Banner
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
          loading={bannersDataGridOptions.loading}
          rowCount={bannersDataGridOptions.totalRows}
          rowsPerPageOptions={bannersDataGridOptions.rowsPerPageOptions}
          rows={bannersDataGridOptions.rows}
          columns={bannersDataGridColumns}
          page={bannersDataGridOptions.page - 1}
          pageSize={bannersDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setBannersDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateBannersDataGridOptions("page", 1);
            updateBannersDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the banner?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteProfessionTypesDialog}
        handleDialogClose={handleCloseDeleteProfessionTypesDialog}
        handleDialogAction={handleConfirmDeleteProfessionTypesAction}
      />
      {/* datatable end */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{id ? "Edit Banner" : " Add Banner"}</DialogTitle>
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
            URL <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter URL"
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
  Page <span style={{ color: "red" }}>*</span>
</Typography>
<FormControl fullWidth>
  <Select
    value={page}
    onChange={(e) => setPage(e.target.value)}
    displayEmpty
    variant="standard"
  >
    <MenuItem value="" disabled>Select Page</MenuItem>
    {pageOptions.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>

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
            Banner <span style={{ color: "red" }}>*</span>
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
  bannersList: state.banner.bannersList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    bannersListSuccess: (data) => dispatch(bannersListSuccess(data)),
    bannersListFailed: () => dispatch(bannersListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Banners);
