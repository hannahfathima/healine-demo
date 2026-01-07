import { Button, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import React, { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import {
  deleteRecord,
  fetchList,
  getRecord,
} from "../../apis/services/CommonApiService";
import FormikCheckBox from "../../components/Formik/FormikCheckBox";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import CustomIconButton from "../../shared/components/CustomIconButton";
import { Routing } from "../../shared/constants/routing";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

import { DisplayFormikState } from "../../utils/helper";
import {
  daysOfWeekNames,
  rowsPerPageJsonData,
  yesNoOptions,
} from "../../utils/jsonData";
import {
  departmentDetailFailed,
  departmentDetailSuccess,
  deptWorkingHrsListFailed,
  deptWorkingHrsListSuccess,
} from "../../store/reducers/departmentSlice";

const useStyles = makeStyles({
  label: {
    marginBottom: "11px",
    color: "#1E1E1E",
    fontSize: "16px",
    fontWeight: "500",
  },
  value: {
    color: "#000",
    paddingLeft: "5px",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "end",
    marginRight: "20px",
    marginBottom: "20px",
    borderTop: "2px solid",
    marginTop: "20px",
    paddingTop: "20px",
  },
  backBtn: {
    justifyContent: "center",
    width: "98px",
    height: "44px",
    textTransform: "capitalize",
    background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
  },
});

function ManageDepartmentHours(props) {
  const {
    departmentDetail,
    deptWorkingHrsList,
    departmentDetailSuccess,
    departmentDetailFailed,
    deptWorkingHrsListSuccess,
    deptWorkingHrsListFailed,
  } = props;
  let { departmentId } = useParams();
  const classes = useStyles();
  const getDepartmentDetail = useCallback(
    async (departmentId) => {
      const result = await getRecord(
        departmentId,
        ApiEndPoints.DEPARTMENT_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        departmentDetailSuccess(result.data);
      } else {
        departmentDetailFailed();
        <Navigate to={Routing.Departments} />;
      }
    },
    [departmentId]
  );

  useEffect(() => {
    getDepartmentDetail(departmentId);
  }, [departmentId, getDepartmentDetail]);

  const navigate = useNavigate();

  const [pageNo, setPageNo] = useState(1);
  const [dataGridOptions, setDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });

  const dataGridColumns = [
    {
      field: "day_of_week",
      headerName: "Day",
      flex: 1,
      renderCell: (params) => <>{daysOfWeekNames[params.value]}</>,
    },
    { field: "start_time", headerName: "Start Time", flex: 1 },
    { field: "end_time", headerName: "End Time", flex: 1 },
    // {
    //   field: "is_day_off",
    //   headerName: "Is Day Off",
    //   flex: 1,
    //   renderCell: (params) => <>{params.value === 1 ? "Yes" : "No"}</>,
    // },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              navigate(`/departments/manage-hours/edit/${params.id}`);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              handleDeleteRecord(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setDataGridData(deptWorkingHrsList);
  }, [deptWorkingHrsList]);

  const setDataGridData = (data) => {
    const specDatagridRows = data?.map((item, index) => {
      return {
        id: item.id,
        day_of_week: item.day_of_week,
        start_time: item?.start_time,
        end_time: item?.end_time,
        // is_day_off: item?.is_day_off,
        actions: "Actions",
      };
    });
    updateDataGridOptions("rows", specDatagridRows);
  };

  const updateDataGridOptions = (k, v) =>
    setDataGridOptions((prev) => ({ ...prev, [k]: v }));
  const getWorkingHoursList = useCallback(async () => {
    updateDataGridOptions("loading", true);
    const result = await fetchList(
      ApiEndPoints.DEPARTMENT_HOURS_RESOURCE_ROUTE +
        `?page_no=${dataGridOptions.page}&items_per_page=${dataGridOptions.pageSize}&department_id=${departmentId}`
    );
    if (result.status === 200) {
      updateDataGridOptions("totalRows", result.data.count);
      deptWorkingHrsListSuccess(result.data.rows);
      updateDataGridOptions("loading", false);
    } else {
      updateDataGridOptions("totalRows", []);
      deptWorkingHrsListFailed();
      updateDataGridOptions("loading", false);
    }
  }, [dataGridOptions.page, dataGridOptions.pageSize]);

  useEffect(() => {
    getWorkingHoursList();
  }, [getWorkingHoursList]);

  useEffect(() => {
    getWorkingHoursList();
  }, [pageNo]);

  //delete room rate api
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const [deleteRecordId, setDeleteRecordId] = useState(0);
  const handleConfirmDeleteAction = async () => {
    setOpenDeleteDialog(false);
    const result = await deleteRecord(
      deleteRecordId,
      ApiEndPoints.DEPARTMENT_HOURS_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      getWorkingHoursList();
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteRecord = (id) => {
    setDeleteRecordId(id);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">
          Manage Department Working Hours
        </h4>
      </div>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={6}>
          <Typography className={classes.label}>Name</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {departmentDetail?.name}
          </Typography>
        </Grid>
        <Grid item lg={6}>
          <Typography className={classes.label}>Establishment Name</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {departmentDetail?.establishmentInfo?.name}
          </Typography>
        </Grid>
      </Grid>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() =>
            navigate(`/departments/manage-hours/add/${departmentId}`)
          }
        >
          Add Working Hours
        </Button>
      </div>

      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={dataGridOptions.loading}
          rowCount={dataGridOptions.totalRows}
          rowsPerPageOptions={dataGridOptions.rowsPerPageOptions}
          rows={dataGridOptions.rows}
          columns={dataGridColumns}
          page={dataGridOptions.page - 1}
          pageSize={dataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updateDataGridOptions("page", 1);
            updateDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      {/* Delete Hotel Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete the establishment working hours?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteDialog}
        handleDialogClose={handleCloseDeleteDialog}
        handleDialogAction={handleConfirmDeleteAction}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  departmentDetail: state.department.departmentDetail,
  deptWorkingHrsList: state.department.deptWorkingHrsList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    departmentDetailSuccess: (data) => dispatch(departmentDetailSuccess(data)),
    departmentDetailFailed: () => dispatch(departmentDetailFailed()),
    deptWorkingHrsListSuccess: (data) =>
      dispatch(deptWorkingHrsListSuccess(data)),
    deptWorkingHrsListFailed: () => dispatch(deptWorkingHrsListFailed()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageDepartmentHours);
