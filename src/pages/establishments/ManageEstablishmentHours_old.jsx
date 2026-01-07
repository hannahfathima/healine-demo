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
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { createRecord, getRecord } from "../../apis/services/CommonApiService";
import FormikCheckBox from "../../components/Formik/FormikCheckBox";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import { Routing } from "../../shared/constants/routing";
import {
  AddDepartmentHoursValidator,
  AddEstablishmentHoursValidator,
} from "../../shared/validations/CommonValidations";
import {
  establishmentDetailFailed,
  establishmentDetailSuccess,
} from "../../store/reducers/establishmentSlice";

import { DisplayFormikState } from "../../utils/helper";
import { yesNoOptions } from "../../utils/jsonData";

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

function ManageEstablishmentHours(props) {
  const {
    establishmentDetail,
    establishmentDetailSuccess,
    establishmentDetailFailed,
  } = props;
  let { establishmentId } = useParams();
  const classes = useStyles();
  const getEstablishmentDetail = useCallback(
    async (establishmentId) => {
      const result = await getRecord(
        establishmentId,
        ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        establishmentDetailSuccess(result.data);
      } else {
        establishmentDetailFailed();
        <Navigate to={Routing.Establishment} />;
      }
    },
    [establishmentId]
  );

  useEffect(() => {
    getEstablishmentDetail(establishmentId);
  }, [establishmentId, getEstablishmentDetail]);

  const navigate = useNavigate();

  const initialState = {
    name: establishmentDetail?.name,
    establishment_id: establishmentId,
    hours_data: establishmentDetail?.newWorkingHoursDetails,
  };

  const handleSubmit = async (values) => {
    console.log("values", values);
    let formData = {
      establishment_id: values.establishment_id,
      hours_data: values.hours_data,
    };
    const result = await createRecord(
      formData,
      ApiEndPoints.CREATE_ESTABLISHMENT_HOURS
    );
    if (result.status === 200) {
      toast.success(result.message);
      navigate(Routing.Establishment);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">
          Manage Establishment Working Hours
        </h4>
      </div>
      {establishmentDetail && establishmentDetail?.name ? (
        <Formik
          initialValues={initialState}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={true}
          enableReinitialize={true}
          validationSchema={AddEstablishmentHoursValidator}
        >
          {(props) => {
            const { handleSubmit } = props;
            return (
              <>
                <form onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item lg={6}>
                      <Typography className={classes.label}>Name</Typography>
                      <Typography className={classes.value} variant="subtitle1">
                        {establishmentDetail?.name}
                      </Typography>
                    </Grid>
                    <Grid item lg={6}>
                      <Typography className={classes.label}>
                        Establishment Type
                      </Typography>
                      <Typography className={classes.value} variant="subtitle1">
                        {establishmentDetail?.establishmentTypeInfo?.name}
                      </Typography>
                    </Grid>
                    <Grid item lg={6}>
                      <Typography className={classes.label}>
                        Establishment Working Hours
                      </Typography>
                    </Grid>
                  </Grid>

                  <FieldArray name="hours_data">
                    {({ push, remove }) => (
                      <Grid
                        container
                        spacing={2}
                        sx={{ marginTop: 2, paddingX: 2 }}
                      >
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  style={{
                                    minWidth: "140px",
                                    border: "1px solid #B4ADAD",
                                  }}
                                >
                                  DAY
                                </TableCell>
                                <TableCell
                                  style={{
                                    minWidth: "140px",
                                    border: "1px solid #B4ADAD",
                                  }}
                                >
                                  START TIME
                                </TableCell>
                                <TableCell
                                  style={{
                                    minWidth: "140px",
                                    border: "1px solid #B4ADAD",
                                  }}
                                >
                                  END TIME
                                </TableCell>
                                <TableCell
                                  style={{
                                    minWidth: "140px",
                                    border: "1px solid #B4ADAD",
                                  }}
                                >
                                  IS DAY OFF
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {props.values.hours_data.map((_, index) => (
                                <>
                                  {/* {rows.map((row) => ( */}
                                  <TableRow
                                    key={index}
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell
                                      style={{ border: "1px solid #B4ADAD" }}
                                    >
                                      <Grid item lg={12}>
                                        <Typography className={classes.label}>
                                          {
                                            props.values.hours_data[`${index}`][
                                              "day_of_week_name"
                                            ]
                                          }
                                        </Typography>
                                      </Grid>
                                    </TableCell>
                                    <TableCell
                                      style={{ border: "1px solid #B4ADAD" }}
                                    >
                                      <Grid item lg={12}>
                                        <Field
                                          type="time"
                                          placeholder="Enter width"
                                          name={`hours_data.${index}.start_time`}
                                          component={FormikInput}
                                        />
                                        <ErrorMessage
                                          name={`hours_data.${index}.start_time`}
                                          component={ShowInputError}
                                        />
                                      </Grid>
                                    </TableCell>
                                    <TableCell
                                      style={{ border: "1px solid #B4ADAD" }}
                                    >
                                      <Grid item lg={12}>
                                        <Field
                                          type="time"
                                          placeholder="Enter width"
                                          name={`hours_data.${index}.end_time`}
                                          component={FormikInput}
                                        />
                                        <ErrorMessage
                                          name={`hours_data.${index}.end_time`}
                                          component={ShowInputError}
                                        />
                                      </Grid>
                                    </TableCell>
                                    <TableCell
                                      style={{ border: "1px solid #B4ADAD" }}
                                    >
                                      <Grid item lg={12}>
                                        <Field
                                          // label="MATTRESS"
                                          name={`hours_data.${index}.is_day_off`}
                                          // defaultOption
                                          options={yesNoOptions?.map(
                                            (data) => ({
                                              title: data.name,
                                              value: data.id,
                                            })
                                          )}
                                          component={FormikSelect}
                                        />
                                        <ErrorMessage
                                          name={`hours_data.${index}.is_day_off`}
                                          component={ShowInputError}
                                        />
                                      </Grid>
                                    </TableCell>
                                  </TableRow>
                                </>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    )}
                  </FieldArray>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginRight: "20px",
                      marginBottom: "20px",
                      borderTop: "2px solid",
                      marginTop: "20px",
                      paddingTop: "20px",
                    }}
                  >
                    <Grid item xs={2}>
                      <Button
                        className="mt-1"
                        size="large"
                        variant="contained"
                        disableElevation
                        type="submit"
                        color="primary"
                        style={{
                          justifyContent: "center",
                          width: "150px",
                          height: "44px",
                          textTransform: "capitalize",
                          background:
                            "linear-gradient(180deg, #255480 0%, #173450 100%)",
                        }}
                      >
                        Update Hours
                      </Button>
                    </Grid>
                  </div>
                  {/* <DisplayFormikState {...props} /> */}
                </form>
              </>
            );
          }}
        </Formik>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  establishmentDetail: state.establishment.establishmentDetail,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    establishmentDetailSuccess: (data) =>
      dispatch(establishmentDetailSuccess(data)),
    establishmentDetailFailed: () => dispatch(establishmentDetailFailed()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageEstablishmentHours);
