import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Input, Uploader } from "rsuite";
import { Table } from "rsuite";
import {
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
import { Link, Navigate, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import { rowsPerPageJsonData, specialitiesData } from "../../utils/jsonData";
import { toast } from "react-toastify";
import { deleteRecord, fetchList } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { connect } from "react-redux";
import {
  professionsListFailed,
  professionsListSuccess,
} from "../../store/reducers/professionSlice";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// 👉 ADD THIS STATE

import SearchIcon from "@mui/icons-material/Search";
import {
  specialitiesListFailed,
  specialitiesListSuccess,
  establishmentsListSuccess, // ADD THIS
  establishmentsListFailed, // ADD THIS
  professionsListByEstablishmentSuccess, // ADD THIS
  professionsListByEstablishmentFailed, // ADD THIS
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

const Proffesionals = (props) => {
  const {
    professionsList,
    professionsListSuccess,
    professionsListFailed,
    specialitiesListSuccess,
    specialitiesListFailed,
    specialitiesList,
    establishmentsList, // ADD THIS
    establishmentsListSuccess, // ADD THIS
    establishmentsListFailed, // ADD THIS
    professionsListByEstablishment, // ADD THIS
    professionsListByEstablishmentSuccess, // ADD THIS
    professionsListByEstablishmentFailed, // ADD THIS
  } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    navigate("/professions/add");
  };

  const [pageNo, setPageNo] = useState(1);
  const [professionDataGridOptions, setProfessionDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [searchFilters, setSearchFilters] = useState({
    searchText: "",
    searchSpeciality: 0,
    searchEstablishment: 0, // ADD THIS LINE

  });
  const [estSearchText, setEstSearchText] = useState("");

  const professionDataGridColumns = [
    {
      field: "licence_no",
      headerName: "License NO",
      flex: 1,
      renderCell: (params) => (
        <>
          {params.value ? (
            <Link to={`/professions/view/${params.row.id}`}>
              {params.value}
            </Link>
          ) : null}
        </>
      ),
    },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "profession_name", headerName: "Profession Type", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "photo",
      headerName: "Photo",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="Professional Photo"
            style={{ height: "50px", width: "75px", objectFit: "cover" }}
          />
        ) : (
          <Typography>No Photo</Typography>
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
              navigate(`/professions/view/${params.id}`);
            }}
            arialLabel="View"
            icon={<RemoveRedEyeIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              editProfession(params.id);
            }}
            arialLabel="Edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteProfession(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
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

  ];

  useEffect(() => {
    setProfessionData(professionsList);
  }, [professionsList]);
  const sortBySearchPriority = (data, searchText) => {
    if (!searchText || searchText.trim() === '') {
      return data;
    }

    const search = searchText.toLowerCase().trim();

    return [...data].sort((a, b) => {
      const aFirstName = (a.first_name || '').toLowerCase();
      const bFirstName = (b.first_name || '').toLowerCase();
      const aLastName = (a.last_name || '').toLowerCase();
      const bLastName = (b.last_name || '').toLowerCase();

      // Check if first name starts with search term
      const aFirstStartsWith = aFirstName.startsWith(search);
      const bFirstStartsWith = bFirstName.startsWith(search);

      // Check if last name starts with search term
      const aLastStartsWith = aLastName.startsWith(search);
      const bLastStartsWith = bLastName.startsWith(search);

      // Priority 1: First name starts with search term
      if (aFirstStartsWith && !bFirstStartsWith) return -1;
      if (!aFirstStartsWith && bFirstStartsWith) return 1;

      // Priority 2: Last name starts with search term
      if (aLastStartsWith && !bLastStartsWith) return -1;
      if (!aLastStartsWith && bLastStartsWith) return 1;

      // Priority 3: First name contains search term
      const aFirstContains = aFirstName.includes(search);
      const bFirstContains = bFirstName.includes(search);
      if (aFirstContains && !bFirstContains) return -1;
      if (!aFirstContains && bFirstContains) return 1;

      // Priority 4: Last name contains search term
      const aLastContains = aLastName.includes(search);
      const bLastContains = bLastName.includes(search);
      if (aLastContains && !bLastContains) return -1;
      if (!aLastContains && bLastContains) return 1;

      // Default: alphabetical by first name
      return aFirstName.localeCompare(bFirstName);
    });
  };
  const setProfessionData = (data) => {
    // Sort data based on search priority
    const sortedData = sortBySearchPriority(data, searchFilters.searchText);

    const profDatagridRows = sortedData?.map((item) => {
      return {
        id: item.id,
        licence_no: item.licence_no,
        first_name: item.first_name,
        last_name: item.last_name,
        profession_name: item?.professionTypeInfo?.name || "",
        email: item.email,
        phone: item.phone,
        photo: item.photo,
        active_status: item.active_status,   // ⭐ ADDED

        actions: "Actions",
      };
    });
    updateProfessionDataGridOptions("rows", profDatagridRows);
  };

  const updateProfessionDataGridOptions = (k, v) =>
    setProfessionDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getSpecialitiesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_SPECIALITIES_FOR_SELECT);
    if (result.status === 200) {
      specialitiesListSuccess(result.data);
    } else {
      specialitiesListFailed();
    }
  }, []);

  useEffect(() => {
    getSpecialitiesList();
  }, [getSpecialitiesList]);

  const getProfessionList = useCallback(async () => {
    updateProfessionDataGridOptions("loading", true);

    // If establishment is selected, use the filtered list
    if (searchFilters.searchEstablishment !== 0) {
      const filteredData = professionsListByEstablishment.filter(item => {
        const matchesSearch = searchFilters.searchText === "" ||
          item.first_name?.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
          item.last_name?.toLowerCase().includes(searchFilters.searchText.toLowerCase());

        return matchesSearch;
      });

      updateProfessionDataGridOptions("totalRows", filteredData.length);
      professionsListSuccess(filteredData);
      updateProfessionDataGridOptions("loading", false);
      return;
    }

    // Original API call when no establishment is selected
    const result = await fetchList(
      ApiEndPoints.PROFESSION_RESOURCE_ROUTE +
      `?page_no=${professionDataGridOptions.page}&items_per_page=${professionDataGridOptions.pageSize}&search_text=${searchFilters.searchText}&speciality=${searchFilters.searchSpeciality}`
    );
    if (result.status === 200) {
      updateProfessionDataGridOptions("totalRows", result.data.count);
      professionsListSuccess(result.data.rows);
      updateProfessionDataGridOptions("loading", false);
    } else {
      updateProfessionDataGridOptions("totalRows", []);
      professionsListFailed();
      updateProfessionDataGridOptions("loading", false);
    }
  }, [
    professionDataGridOptions.page,
    professionDataGridOptions.pageSize,
    searchFilters.searchText,
    searchFilters.searchSpeciality,
    searchFilters.searchEstablishment, // ADD THIS
    professionsListByEstablishment, // ADD THIS
  ]);

  useEffect(() => {
    getProfessionList();
  }, [getProfessionList]);

  useEffect(() => {
    getProfessionList();
  }, [pageNo]);

  const editProfession = (id) => {
    navigate(`/professions/edit/${id}`);
  };

  const [openDeleteProfessionDialog, setOpenDeleteProfessionDialog] =
    React.useState(false);
  const handleCloseDeleteProfessionDialog = () =>
    setOpenDeleteProfessionDialog(false);
  const [professionId, setDeleteProfessionId] = useState(0);
  const handleConfirmDeleteProfessionAction = async () => {
    setOpenDeleteProfessionDialog(false);
    const result = await deleteRecord(
      professionId,
      ApiEndPoints.PROFESSION_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getProfessionList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteProfession = (id) => {
    setDeleteProfessionId(id);
    setOpenDeleteProfessionDialog(true);
  };

  const handleProfessionsSearch = (event) => {
    const { value } = event.target;
    setSearchFilters((prev) => ({
      ...prev,
      searchText: value,
    }));
  };

  const handleSpecilityChange = (event) => {
    const { value } = event.target;
    setSearchFilters((prev) => ({
      ...prev,
      searchSpeciality: value,
    }));
  };
  const getEstablishmentsList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_ESTABLISHMENT_FOR_SELECT);
    if (result.status === 200) {
      result.data.sort((a, b) => a.name.localeCompare(b.name));   // <-- ADDED
      establishmentsListSuccess(result.data);
    }
    else {
      establishmentsListFailed();
    }
  }, []);
  const getProfessionsByEstablishment = useCallback(async (establishmentId) => {
    if (!establishmentId || establishmentId === 0) {
      professionsListByEstablishmentFailed();
      return;
    }

    const result = await fetchList(
      `${ApiEndPoints.GET_PROFESSIONS_BY_ESTABLISHMENT}?establishment_id=${establishmentId}`
    );
    if (result.status === 200) {
      professionsListByEstablishmentSuccess(result.data);
    } else {
      professionsListByEstablishmentFailed();
    }
  }, []);

  useEffect(() => {
    getEstablishmentsList();
  }, [getEstablishmentsList]);
  const handleEstablishmentChange = (event) => {
    const { value } = event.target;
    setSearchFilters((prev) => ({
      ...prev,
      searchEstablishment: value,
    }));
    getProfessionsByEstablishment(value);
  };

  // ⭐ NEW FUNCTION — TOGGLE ACTIVE STATUS
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      const payload = { id, active_status: newStatus };

      const result = await axios.patch(
        ApiEndPoints.UPDATE_PROFESSION_STATUS,
        payload
      );

      if (result.status === 200) {
        toast.success(`Status updated to ${newStatus ? "Active" : "Inactive"}`);
        getProfessionList();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
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
        <Typography variant="h4">Professionals List</Typography>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Professionals
        </Button>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4} style={{ marginBottom: "20px" }}>
          <FormControl fullWidth>
            <TextField
              label="Search Professionals"
              onChange={(event) => {
                handleProfessionsSearch(event);
              }}
              value={searchFilters.searchText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchFilters.searchText && (
                      <IconButton
                        onClick={() => {
                          setSearchFilters((prev) => ({
                            ...prev,
                            searchText: "",
                          }));
                        }}
                      >
                        <CloseIcon />
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
        <Grid item lg={4} style={{ marginBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Speciality</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchFilters.searchSpeciality}
              label="Speciality"
              onChange={handleSpecilityChange}
            >
              <MenuItem value={0}>Select Speciality</MenuItem>
              {specialitiesList?.map((data) => (
                <MenuItem value={data.id}>{data.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={4} style={{ marginBottom: "20px" }}>
          <FormControl sx={{ width: "300px" }}>
            <InputLabel id="establishment-select-label">Establishment</InputLabel>
            <Select
              labelId="establishment-select-label"
              id="establishment-select"
              value={searchFilters.searchEstablishment}
              label="Establishment"
              onChange={handleEstablishmentChange}

              // 👉 ADD THIS BLOCK
              MenuProps={{
                PaperProps: {
                  sx: { width: 350 }
                }
              }}
            >

              {/* 👉 SEARCH BOX INSIDE DROPDOWN */}
              <MenuItem disableRipple disableTouchRipple>
                <TextField
                  size="small"
                  placeholder="Search Establishment"
                  fullWidth
                  value={estSearchText}
                  onChange={(e) => setEstSearchText(e.target.value)}

                  InputProps={{
                    endAdornment: estSearchText ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEstSearchText("");
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ) : null,
                  }}

                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") e.stopPropagation();
                  }}
                />
              </MenuItem>


              <MenuItem value={0}>Select Establishment</MenuItem>

              {/* 👉 APPLY FILTER BEFORE MAPPING */}
              {establishmentsList
                ?.filter((item) =>
                  item.name.toLowerCase().includes(estSearchText.toLowerCase())
                )
                .map((data) => (

                  <MenuItem value={data.id} key={data.id}>
                    {data.name}
                  </MenuItem>
                ))}
            </Select>

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
          loading={professionDataGridOptions.loading}
          rowCount={professionDataGridOptions.totalRows}
          rowsPerPageOptions={professionDataGridOptions.rowsPerPageOptions}
          rows={professionDataGridOptions.rows}
          columns={professionDataGridColumns}
          page={professionDataGridOptions.page - 1}
          pageSize={professionDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setProfessionDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateProfessionDataGridOptions("page", 1);
            updateProfessionDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the profession?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteProfessionDialog}
        handleDialogClose={handleCloseDeleteProfessionDialog}
        handleDialogAction={handleConfirmDeleteProfessionAction}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  professionsList: state.profession.professionsList,
  specialitiesList: state.common.specialitiesList,
  establishmentsList: state.common.establishmentsList, // ADD THIS
  professionsListByEstablishment: state.common.professionsListByEstablishment, // ADD THIS

});

const mapDispatchToProps = (dispatch) => {
  return {
    professionsListSuccess: (data) => dispatch(professionsListSuccess(data)),
    professionsListFailed: () => dispatch(professionsListFailed()),
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
    establishmentsListSuccess: (data) => dispatch(establishmentsListSuccess(data)), // ADD THIS
    establishmentsListFailed: () => dispatch(establishmentsListFailed()), // ADD THIS
    professionsListByEstablishmentSuccess: (data) => dispatch(professionsListByEstablishmentSuccess(data)), // ADD THIS
    professionsListByEstablishmentFailed: () => dispatch(professionsListByEstablishmentFailed()), // ADD THIS

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Proffesionals);