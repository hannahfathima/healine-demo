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
import {
  AddDepartmentHolidayValidator,
  AddDepartmentHoursValidator,
  AddEstablishmentHoursValidator,
} from "../../../shared/validations/CommonValidations";
import { daysOfWeekNames, yesNoOptions } from "../../../utils/jsonData";

export const AddDepartmentHoliday = (props) => {
  const navigate = useNavigate();
  let { departmentId } = useParams();
  const initialState = {
    department_id: departmentId,
    date: "",
    occasion: "",
  };

  const handleSubmit = async (values) => {
    let formData = {
      department_id: values.department_id,
      date: values.date,
      occasion: values.occasion,
    };
    const result = await createRecord(
      formData,
      ApiEndPoints.DEPARTMENT_HOLIDAYS_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      navigate(`/departments/manage-holidays/${departmentId}`);
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
        <h4 className="pagename-heading ml-0">Add Department Holiday</h4>
      </div>
      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={true}
        enableReinitialize={true}
        validationSchema={AddDepartmentHolidayValidator}
      >
        {(props) => {
          const { handleSubmit } = props;
          return (
            <>
              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item lg={6}>
                    <Field
                      type="date"
                      label="Date"
                      required
                      name="date"
                      component={FormikInput}
                    />
                    <ErrorMessage name="date" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={6}>
                    <Field
                      type="text"
                      label="Occasion"
                      name="occasion"
                      component={FormikInput}
                    />
                    <ErrorMessage name="occasion" component={ShowInputError} />
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
)(AddDepartmentHoliday);
