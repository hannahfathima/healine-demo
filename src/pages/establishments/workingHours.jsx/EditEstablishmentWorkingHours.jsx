import { Button, Grid, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Formik } from "formik";
import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../../apis/ApiEndPoints";
import {
  createRecord,
  getRecord,
  updateRecord,
} from "../../../apis/services/CommonApiService";
import FormikInput from "../../../components/Formik/FormikInput";
import FormikSelect from "../../../components/Formik/FormikSelect";
import ShowInputError from "../../../components/ShowInputError";
import { Routing } from "../../../shared/constants/routing";
import {
  AddEstablishmentHoursValidator,
  EditEstablishmentHoursValidator,
} from "../../../shared/validations/CommonValidations";
import {
  estWorkingHoursDetailFailed,
  estWorkingHoursDetailSuccess,
} from "../../../store/reducers/establishmentSlice";
import { daysOfWeekNames, yesNoOptions } from "../../../utils/jsonData";

export const EditEstablishmentWorkingHours = (props) => {
  const {
    estWorkingHoursDetail,
    estWorkingHoursDetailSuccess,
    estWorkingHoursDetailFailed,
  } = props;
  const navigate = useNavigate();
  let { hoursId } = useParams();

  const getEstablishmentHoursDetail = useCallback(
    async (hoursId) => {
      const result = await getRecord(
        hoursId,
        ApiEndPoints.ESTABLISHMENT_HOURS_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        estWorkingHoursDetailSuccess(result.data);
      } else {
        estWorkingHoursDetailFailed();
        <Navigate to={Routing.Establishment} />;
      }
    },
    [hoursId]
  );

  useEffect(() => {
    getEstablishmentHoursDetail(hoursId);
  }, [hoursId, getEstablishmentHoursDetail]);

  const initialState = {
    establishment_id: estWorkingHoursDetail?.establishment_id,
    day_of_week: estWorkingHoursDetail?.day_of_week,
    start_time: estWorkingHoursDetail?.start_time,
    end_time: estWorkingHoursDetail?.end_time,
    // is_day_off: estWorkingHoursDetail?.is_day_off,
  };

  const handleSubmit = async (values) => {
    let formData = {
      establishment_id: values.establishment_id,
      day_of_week: values.day_of_week,
      start_time: values.start_time,
      end_time: values.end_time,
      is_day_off: 0,
    };
    const result = await updateRecord(
      formData,
      hoursId,
      ApiEndPoints.ESTABLISHMENT_HOURS_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      navigate(
        `/establishments/manage-hours/${estWorkingHoursDetail.establishment_id}`
      );
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
        <h4 className="pagename-heading ml-0">Edit Establishment Hours</h4>
      </div>
      {estWorkingHoursDetail ? (
        <Formik
          initialValues={initialState}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={true}
          enableReinitialize={true}
          validationSchema={EditEstablishmentHoursValidator}
        >
          {(props) => {
            const { handleSubmit, handleReset, dirty, isSubmitting } = props;
            return (
              <>
                <form onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item lg={4}>
                      <Typography
                        style={{
                          marginBottom: "11px",
                          color: "rgb(30, 30, 30)",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: "500",
                        }}
                      >
                        Select Day <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <Field
                        label="Select Day"
                        name="day_of_week"
                        type="select"
                        options={daysOfWeekNames?.map((data, index) => ({
                          title: data,
                          value: index,
                        }))}
                        component={FormikSelect}
                      />
                      <ErrorMessage
                        name="day_of_week"
                        component={ShowInputError}
                      />
                    </Grid>
                    {/* <Grid item lg={6}>
                      <Typography
                        style={{
                          marginBottom: "11px",
                          color: "rgb(30, 30, 30)",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: "500",
                        }}
                      >
                        Is Day Off <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <Field
                        name="is_day_off"
                        options={yesNoOptions?.map((data) => ({
                          title: data.name,
                          value: data.id,
                        }))}
                        component={FormikSelect}
                      />
                      <ErrorMessage
                        name="is_day_off"
                        component={ShowInputError}
                      />
                    </Grid> */}

                    <Grid item lg={4}>
                      <Field
                        type="time"
                        label="Start Time"
                        required
                        placeholder="Enter width"
                        name="start_time"
                        component={FormikInput}
                      />
                      <ErrorMessage
                        name="start_time"
                        component={ShowInputError}
                      />
                    </Grid>
                    <Grid item lg={4}>
                      <Field
                        type="time"
                        label="End Time"
                        required
                        placeholder="Enter width"
                        name="end_time"
                        component={FormikInput}
                      />
                      <ErrorMessage
                        name="end_time"
                        component={ShowInputError}
                      />
                    </Grid>
                  </Grid>
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
                      {/* <button
                        type="button"
                        className="outline"
                        onClick={handleReset}
                        disabled={!dirty || isSubmitting}
                      >
                        Reset
                      </button> */}

                      <Button
                        className="mt-1"
                        size="large"
                        variant="contained"
                        disableElevation
                        type="submit"
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
                        Update
                      </Button>
                    </Grid>
                  </div>
                </form>
              </>
            );
          }}
        </Formik>
      ) : (
        "null"
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  estWorkingHoursDetail: state.establishment.estWorkingHoursDetail,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    estWorkingHoursDetailSuccess: (data) =>
      dispatch(estWorkingHoursDetailSuccess(data)),
    estWorkingHoursDetailFailed: () => dispatch(estWorkingHoursDetailFailed()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEstablishmentWorkingHours);
