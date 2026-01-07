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
  AddDepartmentHolidayValidator,
  AddDepartmentHoursValidator,
  AddEstablishmentHolidayValidator,
  AddEstablishmentHoursValidator,
} from "../../../shared/validations/CommonValidations";
import {
  establishmentHolidayDetailFailed,
  establishmentHolidayDetailSuccess,
} from "../../../store/reducers/establishmentSlice";
import { daysOfWeekNames, yesNoOptions } from "../../../utils/jsonData";

export const EditEstablishmentHoliday = (props) => {
  const navigate = useNavigate();
  let { holidayId } = useParams();
  const {
    establishmentHolidayDetail,
    establishmentHolidayDetailSuccess,
    establishmentHolidayDetailFailed,
  } = props;
  const getEstablishmentHolidayDetail = useCallback(
    async (holidayId) => {
      const result = await getRecord(
        holidayId,
        ApiEndPoints.ESTABLISHMENT_HOLIDAYS_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        establishmentHolidayDetailSuccess(result.data);
      } else {
        establishmentHolidayDetailFailed();
        <Navigate to={Routing.Establishment} />;
      }
    },
    [holidayId]
  );

  useEffect(() => {
    getEstablishmentHolidayDetail(holidayId);
  }, [holidayId, getEstablishmentHolidayDetail]);

  const initialState = {
    establishment_id: establishmentHolidayDetail?.establishment_id,
    date: establishmentHolidayDetail?.date,
    occasion: establishmentHolidayDetail?.occasion,
  };

  const handleSubmit = async (values) => {
    let formData = {
      establishment_id: values.establishment_id,
      date: values.date,
      occasion: values.occasion,
    };
    const result = await updateRecord(
      formData,
      holidayId,
      ApiEndPoints.ESTABLISHMENT_HOLIDAYS_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      navigate(
        `/establishments/manage-holidays/${establishmentHolidayDetail?.establishment_id}`
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
        <h4 className="pagename-heading ml-0">Edit Establishment Holiday</h4>
      </div>
      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={true}
        enableReinitialize={true}
        validationSchema={AddEstablishmentHolidayValidator}
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

const mapStateToProps = (state) => ({
  establishmentHolidayDetail: state.establishment.establishmentHolidayDetail,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    establishmentHolidayDetailSuccess: (data) =>
      dispatch(establishmentHolidayDetailSuccess(data)),
    establishmentHolidayDetailFailed: () =>
      dispatch(establishmentHolidayDetailFailed()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEstablishmentHoliday);
