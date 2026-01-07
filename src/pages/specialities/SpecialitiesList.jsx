import * as React from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { DataGrid, GridActionsCellItem, GridCloseIcon } from "@mui/x-data-grid";
import { deleteRecord, fetchList } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { rowsPerPageJsonData } from "../../utils/jsonData";
import { connect } from "react-redux";
import {
  specialitiesListFailed,
  specialitiesListSuccess,
} from "../../store/reducers/specialitySlice";
import { useCallback } from "react";
import {
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { getSPecialityTyre } from "../../utils/helper";
import { Routing } from "../../shared/constants/routing";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CustomIconButton from "../../shared/components/CustomIconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Field, Formik } from "formik";
import FormikInput from "../../components/Formik/FormikInput";
const SpecialitiesList = (props) => {
  const { specialitiesList, specialitiesListSuccess, specialitiesListFailed } =
    props;

  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [specialitiesDataGridOptions, setSpecialitiesDataGridOptions] =
    useState({
      loading: false,
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: rowsPerPageJsonData,
      pageSize: 10,
      page: 1,
    });

  const [searchText, setSearchText] = useState("");

  const specialitiesDataGridColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "tier",
      headerName: "Tier",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="subtitle2">
          {getSPecialityTyre(params.value)}
        </Typography>
      ),
    },
    {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      renderCell: (params) => (
        <>
          {params.value ? (
            <img
              style={{ width: "50px", height: "50px" }}
              src={params.value}
              alt={params.row.name}
            />
          ) : null}
        </>
      ),
    },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {/* <CustomIconButton
            onClickAction={() => {
              editSpeciality(params.row.id);
            }}
            arialLabel="View"
            icon={<RemoveRedEyeIcon />}
          /> */}
          <CustomIconButton
            onClickAction={() => {
              editSpeciality(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteSpeciality(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
      // getActions: (params) => [
      //   <GridActionsCellItem
      //     label="Edit"
      //     onClick={editSpeciality(params.id)}
      //     showInMenu
      //   />,
      //   <GridActionsCellItem
      //     label="Delete"
      //     onClick={deleteSpeciality(params.id)}
      //     showInMenu
      //   />,
      // ],
    },
  ];

  useEffect(() => {
    setSpecialitiesData(specialitiesList);
  }, [specialitiesList]);

  const setSpecialitiesData = (data) => {
    const specDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        tier: item.tier,
        icon: item.icon,
        actions: "Actions",
      };
    });
    updateSpecialitiesDataGridOptions("rows", specDatagridRows);
  };

  const updateSpecialitiesDataGridOptions = (k, v) =>
    setSpecialitiesDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getSpecialitiesList = useCallback(async () => {
    updateSpecialitiesDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.SPECIALITIES_RESOURCE_ROUTE +
      `?page_no=${specialitiesDataGridOptions.page}&items_per_page=${specialitiesDataGridOptions.pageSize}&search_text=${searchText}`
    );
    if (result.status === 200) {
      updateSpecialitiesDataGridOptions("totalRows", result.data.count);
      specialitiesListSuccess(result.data.rows);
      updateSpecialitiesDataGridOptions("loading", false);
    } else {
      updateSpecialitiesDataGridOptions("totalRows", []);
      specialitiesListFailed();
      updateSpecialitiesDataGridOptions("loading", false);
    }
  }, [
    specialitiesDataGridOptions.page,
    specialitiesDataGridOptions.pageSize,
    searchText,
  ]);

  useEffect(() => {
    getSpecialitiesList();
  }, [getSpecialitiesList]);

  useEffect(() => {
    getSpecialitiesList();
  }, [pageNo]);

  // const editSpeciality = React.useCallback(
  //   (id) => () => {
  //     navigate(`/specialities/edit/${id}`);
  //   },
  //   []
  // );
  const editSpeciality = (id) => {
    navigate(`/specialities/edit/${id}`);
  };

  //delete room rate api
  const [opendeleteSpecialityDialog, setOpendeleteSpecialityDialog] =
    React.useState(false);
  const handleClosedeleteSpecialityDialog = () =>
    setOpendeleteSpecialityDialog(false);
  const [deleteSpecialityId, setDeleteSpecialityId] = useState(0);
  const handleConfirmdeleteSpecialityAction = async () => {
    setOpendeleteSpecialityDialog(false);
    const result = await deleteRecord(
      deleteSpecialityId,
      ApiEndPoints.SPECIALITIES_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getSpecialitiesList();
    } else {
      toast.error(result.message);
    }
  };

  // const deleteSpeciality = React.useCallback(
  //   (id) => () => {
  //     setDeleteSpecialityId(id);
  //     setOpendeleteSpecialityDialog(true);
  //   },
  //   []
  // );
  const deleteSpeciality = (id) => {
    setDeleteSpecialityId(id);
    setOpendeleteSpecialityDialog(true);
  };

  const handleSpecialitySearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const initialState = {};
  const handleSubmit = {};
  return (
    <div className="min-width">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4">Speciality List</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(Routing.AddSpecialities)}
        >
          Add Speciality
        </Button>
      </div>
      {/* datatable start */}
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4} style={{ marginBottom: "20px" }}>
          <FormControl fullWidth>
            <TextField
              label="Search Speciality"
              onChange={(event) => {
                handleSpecialitySearch(event);
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
          loading={specialitiesDataGridOptions.loading}
          rowCount={specialitiesDataGridOptions.totalRows}
          rowsPerPageOptions={specialitiesDataGridOptions.rowsPerPageOptions}
          rows={specialitiesDataGridOptions.rows}
          columns={specialitiesDataGridColumns}
          page={specialitiesDataGridOptions.page - 1}
          pageSize={specialitiesDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setSpecialitiesDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateSpecialitiesDataGridOptions("page", 1);
            updateSpecialitiesDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the speciality?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={opendeleteSpecialityDialog}
        handleDialogClose={handleClosedeleteSpecialityDialog}
        handleDialogAction={handleConfirmdeleteSpecialityAction}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  specialitiesList: state.speciality.specialitiesList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialitiesList);
