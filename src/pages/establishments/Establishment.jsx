import * as React from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";

import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { DataGrid, GridActionsCellItem, GridCloseIcon } from "@mui/x-data-grid";
import {
  createRecord,
  deleteRecord,
  fetchList,
} from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { toast } from "react-toastify";
import { useState, useEffect, useCallback } from "react";
import { rowsPerPageJsonData } from "../../utils/jsonData";
import { connect } from "react-redux";
import {
  establishmentListFailed,
  establishmentListSuccess,
} from "../../store/reducers/establishmentSlice";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SearchIcon from "@mui/icons-material/Search";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import myCsvFile from "../../assets/images/EstablishmentTestSheet.csv";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { Photo } from "@mui/icons-material";

const Establishment = (props) => {
  const {
    establishmentList,
    establishmentListSuccess,
    establishmentListFailed,
  } = props;

  const openFile = () => {
    const link = document.createElement("a");
    link.href = myCsvFile;
    link.download = "Establishment Test Sheet.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [establishmentDataGridOptions, setEstablishmentDataGridOptions] =
    useState({
      loading: false,
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: rowsPerPageJsonData,
      pageSize: 10,
      page: 1,
    });
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState({ image: "" });
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      const payload = { id, active_status: newStatus };

      const result = await fetch(ApiEndPoints.UPDATE_ESTABLISHMENT_STATUS, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).then((res) => res.json());

      if (result.status === 200) {
        toast.success(`Status updated to ${newStatus ? "Active" : "Inactive"}`);
        getProfessionList(); // refresh grid
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Updated professionDataGridColumns to include Photo instead of Establishment Sub Type
  const professionDataGridColumns = [
    {
      field: "licence_no",
      headerName: "License NO",
      flex: 1,
      renderCell: (params) => (
        <>
          {params.value ? (
            <Link to={`/establishments/view/${params.row.id}`}>
              {params.value}
            </Link>
          ) : null}
        </>
      ),
    },
    { field: "establishment_type", headerName: "Establishment Type", flex: 1 },
    {
      field: "primary_photo",
      headerName: "Photo",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="Establishment Photo"
            style={{ height: "50px", width: "75px", objectFit: "cover" }}
          />
        ) : (
          <Typography>No Photo</Typography>
        ),
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact_number", headerName: "Phone", flex: 1 },
    {
      field: "specialities",
      headerName: "Specialities",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            maxHeight: 66,
            overflowY: "auto",
            whiteSpace: "pre-line",
            padding: "4px",
            display: "block",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    // { field: "created_at", headerName: "Created On", flex: 1 },
    // { field: "modified_at", headerName: "Modified On", flex: 1 },
    {
      field: "active_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Switch
          size="small"
          checked={params.row.active_status === true}
          onChange={() =>
            handleStatusToggle(params.row.id, params.row.active_status)
          }
          color="success"
        />
      ),
    },

    {
      field: "actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              navigate(`/establishments/manage-holidays/${params.id}`);
            }}
            arialLabel="Manage Holidays"
            icon={<HolidayVillageIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              navigate(`/establishments/manage-hours/${params.id}`);
            }}
            arialLabel="Manage Hours"
            icon={<AccessTimeFilledIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              navigate(`/establishments/view/${params.id}`);
            }}
            arialLabel="View"
            icon={<RemoveRedEyeIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              navigate(`/establishments/edit/${params.id}`);
            }}
            arialLabel="Edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteEstablishment(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setEstablishmentData(establishmentList);
  }, [establishmentList]);

  const setEstablishmentData = (data) => {
    const profDatagridRows = data?.map((item) => {
      return {
        id: item.id,
        licence_no: item.licence_no,
        establishment_type: item.establishmentTypeInfo?.name,
        primary_photo: item.primary_photo, // Added primary_photo field
        name: item.name,
        email: item.email,
        contact_number: item.contact_number,
        specialities:
          item?.specialitiesList?.map((item) => item?.name?.name).join(", ") ||
          "",
        // created_at: moment(item.created_at).format("MMM Do YYYY, HH:mm"),
        // modified_at: moment(item.updated_at).format("MMM Do YYYY, HH:mm"),
        active_status: item.active_status, // ⭐ NEW

        actions: "Actions",
      };
    });
    updateEstablishmentDataGridOptions("rows", profDatagridRows);
  };

  const updateEstablishmentDataGridOptions = (k, v) =>
    setEstablishmentDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getProfessionList = useCallback(async () => {
    updateEstablishmentDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE +
      `?page_no=${establishmentDataGridOptions.page}&items_per_page=${establishmentDataGridOptions.pageSize}&search_text=${searchText}`
    );
    if (result.status === 200) {
      updateEstablishmentDataGridOptions("totalRows", result.data.count);
      establishmentListSuccess(result.data.rows);
      updateEstablishmentDataGridOptions("loading", false);
    } else {
      updateEstablishmentDataGridOptions("totalRows", []);
      establishmentListFailed();
      updateEstablishmentDataGridOptions("loading", false);
    }
  }, [
    establishmentDataGridOptions.page,
    establishmentDataGridOptions.pageSize,
    searchText,
  ]);

  useEffect(() => {
    getProfessionList();
  }, [getProfessionList]);

  useEffect(() => {
    getProfessionList();
  }, [pageNo]);

  const [openDeleteEstablishmentDialog, setOpenDeleteEstablishmentDialog] =
    React.useState(false);
  const handleCloseDeleteEstablishmentDialog = () =>
    setOpenDeleteEstablishmentDialog(false);
  const [deleteEstablishmentId, setDeleteEstablishmentId] = useState(0);
  const handleConfirmDeleteEstablishmentAction = async () => {
    setOpenDeleteEstablishmentDialog(false);
    const result = await deleteRecord(
      deleteEstablishmentId,
      ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getProfessionList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteEstablishment = (id) => {
    setDeleteEstablishmentId(id);
    setOpenDeleteEstablishmentDialog(true);
  };

  const handleProfessionsSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleClose = () => {
    setOpen(false);
    setImage({ image: "" });
  };

  const onSubmit = async () => {
    if (!image.image || image.image === "") {
      toast.error("File is required.");
      return;
    }
    if (image.image.type !== "text/csv") {
      toast.error("Please upload only CSV file.");
      return;
    }

    let formData = new FormData();
    formData.append("file", image.image);
    const result = await createRecord(
      formData,
      ApiEndPoints.ESTABLISHMENT_BULK_UPLOAD_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getProfessionList();
      setImage({ image: "" });
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-width">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4">Establishments List</Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            gap: "20px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/establishments/add")}
          >
            Add Establishments
          </Button>
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Bulk Import Establishments
          </Button>
        </div>
      </div>

      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4} style={{ marginBottom: "20px" }}>
          <FormControl fullWidth>
            <TextField
              label="Search Establishments"
              onChange={(event) => {
                handleProfessionsSearch(event);
              }}
              value={searchText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchText && (
                      <IconButton
                        onClick={() => {
                          setSearchText("");
                        }}
                      >
                        <GridCloseIcon />
                      </IconButton>
                    )}
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: "0px", marginBottom: "20px" }} />

      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={establishmentDataGridOptions.loading}
          rowCount={establishmentDataGridOptions.totalRows}
          rowsPerPageOptions={establishmentDataGridOptions.rowsPerPageOptions}
          rows={establishmentDataGridOptions.rows}
          columns={professionDataGridColumns}
          page={establishmentDataGridOptions.page - 1}
          pageSize={establishmentDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setEstablishmentDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            updateEstablishmentDataGridOptions("page", 1);
            updateEstablishmentDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>

      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the establishment?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteEstablishmentDialog}
        handleDialogClose={handleCloseDeleteEstablishmentDialog}
        handleDialogAction={handleConfirmDeleteEstablishmentAction}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Bulk Import Establishments"}</DialogTitle>
        <DialogContent>
          <Typography
            style={{
              marginTop: "5px",
              marginBottom: "0px",
              color: "rgb(30, 30, 30)",
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: "500",
              display: "inline-block",
            }}
          >
            To download a test CSV file
            <button
              style={{
                padding: "0px",
                paddingLeft: "5px",
              }}
              onClick={openFile}
            >
              click here
            </button>
          </Typography>

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
            Upload CSV File <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="icon"
            type="file"
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
  establishmentList: state.establishment.establishmentList,
});

const mapDispatchToProps = (dispatch) => {
  return {
    establishmentListSuccess: (data) =>
      dispatch(establishmentListSuccess(data)),
    establishmentListFailed: () => dispatch(establishmentListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Establishment);