import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ErrorMessage, Field, Formik } from "formik";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import {
  createRecord,
  fetchList,
  getRecord,
  updateRecord,
} from "../../apis/services/CommonApiService";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import { Routing } from "../../shared/constants/routing";
import { AddDepartmentValidator } from "../../shared/validations/CommonValidations";
import {
  departmentDetailFailed,
  departmentDetailSuccess,
} from "../../store/reducers/departmentSlice";
import {
  establishmentSelectListFailed,
  establishmentSelectListSuccess,
} from "../../store/reducers/establishmentSlice";

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

function ViewDepartment(props) {
  const {
    departmentDetail,
    establishmentForSelectList,
    establishmentSelectListSuccess,
    establishmentSelectListFailed,
    departmentDetailSuccess,
    departmentDetailFailed,
  } = props;
  const classes = useStyles();
  let { departmentId } = useParams();
  const getSpecialityDetail = useCallback(
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
    getSpecialityDetail(departmentId);
  }, [departmentId, getSpecialityDetail]);
  const navigate = useNavigate();
  const initialState = {
    name: departmentDetail?.name,
    establishment_id: departmentDetail?.establishment_id,
  };
  const handleSubmit = async (values) => {
    let formData = {
      name: values.name,
      establishment_id: values.establishment_id,
    };
    const result = await updateRecord(
      formData,
      departmentId,
      ApiEndPoints.DEPARTMENT_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      navigate(Routing.Departments);
    } else {
      toast.error(result.message);
    }
  };

  const getEstablishmentList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_ESTABLISHMENT_FOR_SELECT);
    if (result.status === 200) {
      establishmentSelectListSuccess(result.data);
    } else {
      establishmentSelectListFailed();
    }
  }, []);

  useEffect(() => {
    getEstablishmentList();
  }, [getEstablishmentList]);
  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">View Department</h4>
      </div>
      {departmentDetail && departmentDetail?.name ? (
        <>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item lg={6}>
              <Typography className={classes.label}>Name</Typography>
              <Typography className={classes.value} variant="subtitle1">
                {departmentDetail?.name}
              </Typography>
            </Grid>
            <Grid item lg={6}>
              <Typography className={classes.label}>Establishment</Typography>
              <Typography className={classes.value} variant="subtitle1">
                {departmentDetail?.establishmentInfo?.name}
              </Typography>
            </Grid>
            <Grid item lg={6}>
              <Typography className={classes.label}>Specialities</Typography>
              <Typography className={classes.value} variant="subtitle1">
                {departmentDetail?.specialitiesList
                  .map((item) => item.name.name)
                  .join(", ")}
              </Typography>
            </Grid>
            <Grid item lg={6}>
              <Typography className={classes.label}>Professions</Typography>
              <Typography className={classes.value} variant="subtitle1">
                {departmentDetail?.professionsList
                  .map((item) => item.first_name + " " + item.last_name)
                  .join(", ")}
              </Typography>
            </Grid>
            <Grid item lg={4}>
              <Typography className={classes.label}>
                Department Images
              </Typography>
              <Typography className={classes.value} variant="subtitle1">
                {departmentDetail?.imageList.map((item) => {
                  return (
                    <>
                      <img
                        src={item.image}
                        alt={departmentDetail?.name}
                        style={{
                          height: "50px",
                          width: "75px",
                          marginRight: "5px",
                        }}
                      />
                    </>
                  );
                })}
              </Typography>
            </Grid>
          </Grid>
          {/* <Grid container spacing={2} sx={{ marginTop: 2, paddingX: 2 }}>
            <Typography className={classes.label}>
              Establishment Working Hours
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                    >
                      DAY
                    </TableCell>
                    <TableCell
                      style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                    >
                      START TIME
                    </TableCell>
                    <TableCell
                      style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                    >
                      END TIME
                    </TableCell>
                    <TableCell
                      style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                    >
                      IS DAY OFF
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentDetail?.newWorkingHoursDetails.map(
                    (item, index) => (
                      <>
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell style={{ border: "1px solid #B4ADAD" }}>
                            <Grid item lg={12}>
                              <Typography
                                className={classes.value}
                                variant="subtitle1"
                              >
                                {item?.day_of_week_name}
                              </Typography>
                            </Grid>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #B4ADAD" }}>
                            <Grid item lg={12}>
                              <Typography
                                className={classes.value}
                                variant="subtitle1"
                              >
                                {item?.start_time}
                              </Typography>
                            </Grid>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #B4ADAD" }}>
                            <Grid item lg={12}>
                              <Typography
                                className={classes.value}
                                variant="subtitle1"
                              >
                                {item?.end_time}
                              </Typography>
                            </Grid>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #B4ADAD" }}>
                            <Grid item lg={12}>
                              <Typography
                                className={classes.value}
                                variant="subtitle1"
                              >
                                {item?.is_day_off == 1 ? "Yes" : "No"}
                              </Typography>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid> */}

          <div className={classes.buttonWrapper}>
            <Grid item xs={2}>
              <Button
                className={(classes.buttonWrapper, "mt - 1")}
                size="large"
                variant="contained"
                disableElevation
                onClick={() => {
                  navigate("/departments");
                }}
                color="primary"
                style={{}}
              >
                Back
              </Button>
            </Grid>
          </div>
        </>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  establishmentForSelectList: state.establishment.establishmentForSelectList,
  departmentDetail: state.department.departmentDetail,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    establishmentSelectListSuccess: (data) =>
      dispatch(establishmentSelectListSuccess(data)),
    establishmentSelectListFailed: () =>
      dispatch(establishmentSelectListFailed()),
    departmentDetailSuccess: (data) => dispatch(departmentDetailSuccess(data)),
    departmentDetailFailed: () => dispatch(departmentDetailFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDepartment);
