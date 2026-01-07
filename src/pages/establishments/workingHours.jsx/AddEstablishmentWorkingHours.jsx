import { Button, Grid, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../../apis/ApiEndPoints";
import { createRecord } from "../../../apis/services/CommonApiService";
import FormikInput from "../../../components/Formik/FormikInput";
import FormikSelect from "../../../components/Formik/FormikSelect";
import ShowInputError from "../../../components/ShowInputError";
import { Routing } from "../../../shared/constants/routing";
import { AddEstablishmentHoursValidator } from "../../../shared/validations/CommonValidations";
import { daysOfWeekNames, yesNoOptions } from "../../../utils/jsonData";

export const AddEstablishmentWorkingHours = (props) => {
  const navigate = useNavigate();
  let { establishmentId } = useParams();
  const initialState = {
    establishment_id: establishmentId,
    day_of_week: "",
    // start_time: "",
    start_time: "00:00",
    end_time: "",
    // is_day_off: "",
  };

  const handleSubmit = async (values) => {
    let formData = {
      establishment_id: values.establishment_id,
      day_of_week: values.day_of_week,
      start_time: values.start_time,
      end_time: values.end_time,
      is_day_off: 0,
    };
    const result = await createRecord(
      formData,
      ApiEndPoints.ESTABLISHMENT_HOURS_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      navigate(`/establishments/manage-hours/${establishmentId}`);
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
        <h4 className="pagename-heading ml-0">Add Establishment Hours</h4>
      </div>
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
                    <ErrorMessage name="end_time" component={ShowInputError} />
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
                      Save
                    </Button>
                  </Grid>
                </div>
              </form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEstablishmentWorkingHours);
