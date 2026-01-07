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
import SearchIcon from "@mui/icons-material/Search";
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
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import {
  departmentsListFailed,
  departmentsListSuccess,
} from "../../store/reducers/departmentSlice";

const DepartmentList = (props) => {
  const { departmentsList, departmentsListSuccess, departmentsListFailed } =
    props;

  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [departmentDataGridOptions, setDepartmentDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  const [searchText, setSearchText] = useState("");
  const departmetDataGridColumns = [
    // { field: "name", headerName: "Name", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <>
          {params.value ? (
            <Link to={`/departments/view/${params.row.id}`}>
              {params.value}
            </Link>
          ) : null}
        </>
      ),
    },

    {
      field: "establishment_id",
      headerName: "Establishment Name",
      flex: 1,
      valueGetter: (params) => {
        return (
          <Link
            to={`/establishments/view/${params?.row?.establishment_id?.id}`}
          >
            {params?.row?.establishment_id?.name}
          </Link>
        );
        // return params?.row?.establishment_id?.name;
        // console.log("establishment", params?.row?.establishment_id?.name);
      },

      renderCell: (params) => <>{params.value}</>,

      // renderCell: (params) => (
      //   <>
      //     {params.value ? (
      //       <Link to={`/departments/view/${params.row.id}`}>
      //         {params.value}
      //       </Link>
      //     ) : null}
      //   </>
      // ),
    },
    // { field: "establishment_id", headerName: "Establishment Name", flex: 1 },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              navigate(`/departments/manage-holidays/${params.id}`);
            }}
            arialLabel="Manage Holidays"
            icon={<HolidayVillageIcon />}
            disabled
          />
          <CustomIconButton
            onClickAction={() => {
              navigate(`/departments/manage-hours/${params.id}`);
            }}
            arialLabel="Manage Hours"
            icon={<AccessTimeFilledIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              navigate(`/departments/view/${params.id}`);
            }}
            arialLabel="View"
            icon={<RemoveRedEyeIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              navigate(`/departments/edit/${params.id}`);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deleteDepartment(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
      // getActions: (params) => [
      //   <GridActionsCellItem
      //     label="Manage Hours"
      //     onClick={() => {
      //       navigate(`/departments/manage-hours/${params.id}`);
      //     }}
      //     showInMenu
      //   />,
      //   <GridActionsCellItem
      //     label="View"
      //     onClick={() => {
      //       navigate(`/departments/view/${params.id}`);
      //     }}
      //     showInMenu
      //   />,
      //   <GridActionsCellItem
      //     label="Edit"
      //     onClick={editDepartment(params.id)}
      //     showInMenu
      //   />,
      //   <GridActionsCellItem
      //     label="Delete"
      //     onClick={deleteDepartment(params.id)}
      //     showInMenu
      //   />,
      // ],
    },
  ];

  useEffect(() => {
    setDepartmentData(departmentsList);
  }, [departmentsList]);

  const setDepartmentData = (data) => {
    const deptDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        name: item.name,
        // establishment_id: item.establishmentInfo?.name,
        establishment_id: item.establishmentInfo,
        actions: "Actions",
      };
    });
    updateDepartmentDataGridOptions("rows", deptDatagridRows);
  };

  const updateDepartmentDataGridOptions = (k, v) =>
    setDepartmentDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getDepartmentsList = useCallback(async () => {
    updateDepartmentDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.DEPARTMENT_RESOURCE_ROUTE +
      `?page_no=${departmentDataGridOptions.page}&items_per_page=${departmentDataGridOptions.pageSize}&search_text=${searchText}`
    );
    if (result.status === 200) {
      updateDepartmentDataGridOptions("totalRows", result.data.count);
      departmentsListSuccess(result.data.rows);
      updateDepartmentDataGridOptions("loading", false);
    } else {
      updateDepartmentDataGridOptions("totalRows", []);
      departmentsListFailed();
      updateDepartmentDataGridOptions("loading", false);
    }
  }, [
    departmentDataGridOptions.page,
    departmentDataGridOptions.pageSize,
    searchText,
  ]);

  useEffect(() => {
    getDepartmentsList();
  }, [getDepartmentsList]);

  useEffect(() => {
    getDepartmentsList();
  }, [pageNo]);

  const editDepartment = React.useCallback(
    (id) => () => {
      navigate(`/departments/edit/${id}`);
    },
    []
  );

  //delete room rate api
  const [openDeleteDepartmentDialog, setoOenDeleteDepartmentDialog] =
    React.useState(false);
  const handleCloseDeleteDepartmentDialog = () =>
    setoOenDeleteDepartmentDialog(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState(0);
  const handleConfirmDeleteDepartmentAction = async () => {
    setoOenDeleteDepartmentDialog(false);
    const result = await deleteRecord(
      deleteDepartmentId,
      ApiEndPoints.DEPARTMENT_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getDepartmentsList();
    } else {
      toast.error(result.message);
    }
  };

  const deleteDepartment = (id) => {
    setDeleteDepartmentId(id);
    setoOenDeleteDepartmentDialog(true);
  };

  const handleDepartmentSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
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
        <Typography variant="h4">Department List</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(Routing.AddDepartment)}
        >
          Add Department
        </Button>
      </div>

      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4} style={{ marginBottom: "20px" }}>
          <FormControl fullWidth>
            <TextField
              label="Search Department"
              onChange={(event) => {
                handleDepartmentSearch(event);
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
      {/* datatable start */}
      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={departmentDataGridOptions.loading}
          rowCount={departmentDataGridOptions.totalRows}
          rowsPerPageOptions={departmentDataGridOptions.rowsPerPageOptions}
          rows={departmentDataGridOptions.rows}
          columns={departmetDataGridColumns}
          page={departmentDataGridOptions.page - 1}
          pageSize={departmentDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setDepartmentDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateDepartmentDataGridOptions("page", 1);
            updateDepartmentDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the department?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteDepartmentDialog}
        handleDialogClose={handleCloseDeleteDepartmentDialog}
        handleDialogAction={handleConfirmDeleteDepartmentAction}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  departmentsList: state.department.departmentsList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    departmentsListSuccess: (data) => dispatch(departmentsListSuccess(data)),
    departmentsListFailed: () => dispatch(departmentsListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentList);
