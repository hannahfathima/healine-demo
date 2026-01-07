import { Button, Grid, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Formik } from "formik";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import {
  createRecord,
  getRecord,
  updateRecord,
} from "../../apis/services/CommonApiService";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import { Routing } from "../../shared/constants/routing";
import {
  AddSpecialityValidator,
  EditSpecialityValidator,
} from "../../shared/validations/CommonValidations";
import {
  specialitiesDetailFailed,
  specialitiesDetailSuccess,
} from "../../store/reducers/specialitySlice";
import { specTierData } from "../../utils/jsonData";

export const EditSpeciality = (props) => {
  const navigate = useNavigate();
  const {
    specialitiesDetail,
    specialitiesDetailSuccess,
    specialitiesDetailFailed,
  } = props;
  const initialState = {
    name: specialitiesDetail?.name,
    icon: "",
    description: specialitiesDetail?.description,
    tier: specialitiesDetail?.tier,
  };

  let { specialityId } = useParams();
  const getSpecialityDetail = useCallback(
    async (specialityId) => {
      const result = await getRecord(
        specialityId,
        ApiEndPoints.SPECIALITIES_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        specialitiesDetailSuccess(result.data);
      } else {
        specialitiesDetailFailed();
        <Navigate to={Routing.Specialities} />;
      }
    },
    [specialityId]
  );

  useEffect(() => {
    getSpecialityDetail(specialityId);
  }, [specialityId, getSpecialityDetail]);

  const handleSubmit = async (values) => {
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("icon", values.icon);
    formData.append("description", values.description);
    formData.append("tier", values.tier);
    const result = await updateRecord(
      formData,
      specialityId,
      ApiEndPoints.SPECIALITIES_RESOURCE_ROUTE
    );
    if (result.status === 200) {
      toast.success(result.message);
      navigate(Routing.Specialities);
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
        <h4 className="pagename-heading ml-0">Edit Speciality</h4>
      </div>
      {specialitiesDetail && specialitiesDetail?.name ? (
        <Formik
          initialValues={initialState}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={true}
          enableReinitialize={true}
          validationSchema={EditSpecialityValidator}
        >
          {(props) => {
            const { handleSubmit } = props;
            return (
              <>
                <form onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item lg={6}>
                      <Field
                        label="Name"
                        required
                        name="name"
                        placeHolder="Name"
                        maxLength={150}
                        component={FormikInput}
                      />
                      <ErrorMessage name="name" component={ShowInputError} />
                    </Grid>
                    <Grid item lg={6}>
                      <Typography
                        style={{
                          marginBottom: "11px",
                          color: "rgb(30, 30, 30)",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: "500",
                        }}
                      >
                        Select Speciality Tier{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <Field
                        label="Select Speciality Tier"
                        name="tier"
                        type="select"
                        options={specTierData?.map((data) => ({
                          title: data.name,
                          value: data.id,
                        }))}
                        component={FormikSelect}
                      />
                      <ErrorMessage name="tier" component={ShowInputError} />
                    </Grid>
                    <Grid item lg={6}>
                      <Grid container>
                        <Grid item xs={8}>
                          <Typography
                            style={{
                              marginBottom: "11px",
                              color: "rgb(30, 30, 30)",
                              fontSize: "16px",
                              lineHeight: "24px",
                              fontWeight: "500",
                            }}
                          >
                            Icon
                          </Typography>
                          <TextField
                            fullWidth
                            name="icon"
                            type="file"
                            onChange={(event) => {
                              props.setFieldValue(
                                "icon",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                          <ErrorMessage
                            name="icon"
                            component={ShowInputError}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <img
                            style={{
                              width: "50px",
                              height: "50px",
                              marginLeft: "20px",
                            }}
                            src={specialitiesDetail?.icon}
                            alt={specialitiesDetail?.name}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item lg={6}>
                      <Field
                        label="Description"
                        // required
                        name="description"
                        placeHolder="Description"
                        maxLength={150}
                        component={FormikInput}
                      />
                      <ErrorMessage
                        name="description"
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
                      <Button
                        className="mt-1"
                        size="large"
                        variant="contained"
                        disableElevation
                        type="submit"
                        // onClick={() => {
                        //   navigate("/professionals");
                        // }}
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
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  specialitiesDetail: state.speciality.specialitiesDetail,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    specialitiesDetailSuccess: (data) =>
      dispatch(specialitiesDetailSuccess(data)),
    specialitiesDetailFailed: () => dispatch(specialitiesDetailFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSpeciality);
