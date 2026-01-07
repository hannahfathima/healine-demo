import { Button, Grid, TextField, Typography } from "@mui/material";
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
import FormikAutocomplete from "../../components/Formik/FormikAutocomplete";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import { Routing } from "../../shared/constants/routing";
import { AddDepartmentValidator } from "../../shared/validations/CommonValidations";
import {
  specialitiesListFailed,
  specialitiesListSuccess,
} from "../../store/reducers/commonSlice";
import {
  departmentDetailFailed,
  departmentDetailSuccess,
} from "../../store/reducers/departmentSlice";
import {
  establishmentSelectListFailed,
  establishmentSelectListSuccess,
} from "../../store/reducers/establishmentSlice";
import {
  professionsForSelectListFailed,
  professionsForSelectListSuccess,
} from "../../store/reducers/professionSlice";

function EditDepartment(props) {
  const {
    departmentDetail,
    establishmentForSelectList,
    establishmentSelectListSuccess,
    establishmentSelectListFailed,
    departmentDetailSuccess,
    departmentDetailFailed,
    specialitiesList,
    specialitiesListSuccess,
    specialitiesListFailed,
    professionsForSelectListSuccess,
    professionsForSelectListFailed,
    professionsForSelectList,
  } = props;
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

  const specFromApi = departmentDetail?.specialitiesList.map((item, index) => {
    // return item.speciality_id;
    return {
      id: item.speciality_id,
      name: item.name?.name,
    };
  });
  const professionsFromApi = departmentDetail?.professionsEstablishmentList.map(
    (item, index) => {
      // return item.proffession_id;
      return {
        id: item.proffession_id,
        first_name: item.professionInfo?.first_name,
        last_name: item.professionInfo?.last_name,
      };
    }
  );
  const initialState = {
    name: departmentDetail?.name,
    establishment_id: departmentDetail?.establishment_id,
    specialities: specFromApi || [],
    professions: professionsFromApi || [],
    images: "",
  };
  const handleSubmit = async (values) => {
    var formData = new FormData();
    formData.append("name", values.name);
    formData.append("establishment_id", values.establishment_id);
    formData.append("images", values.images);

    values.specialities.forEach((element, key) => {
      formData.append(`specialities[${key}]`, element.id);
    });
    values.professions.forEach((element, key) => {
      formData.append(`professions[${key}]`, element.id);
    });
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

  // const getSpecialitiesList = useCallback(async () => {
  //   const result = await fetchList(ApiEndPoints.GET_SPECIALITIES_FOR_SELECT);
  //   if (result.status === 200) {
  //     specialitiesListSuccess(result.data);
  //   } else {
  //     specialitiesListFailed();
  //   }
  // }, []);

  // const getProfessionsList = useCallback(async () => {
  //   const result = await fetchList(ApiEndPoints.GET_PROFESSIONS_FOR_SELECT);
  //   if (result.status === 200) {
  //     professionsForSelectListSuccess(result.data);
  //   } else {
  //     professionsForSelectListFailed();
  //   }
  // }, []);
  const onSearchSpecialityChange = async (event) => {
    const { value } = event.target;
    if (value) {
      const result = await fetchList(
        ApiEndPoints.GET_SPECIALITIES_FOR_SELECT + `?search_text=${value}`
      );
      if (result.status === 200) {
        specialitiesListSuccess(result.data);
      } else {
        specialitiesListFailed();
      }
    } else {
      // specialitiesListFailed();
    }
  };

  const onSearchProfessionChange = async (event) => {
    const { value } = event.target;
    if (value) {
      const result = await fetchList(
        ApiEndPoints.GET_PROFESSIONS_FOR_SELECT + `?search_text=${value}`
      );
      if (result.status === 200) {
        professionsForSelectListSuccess(result.data);
      } else {
        professionsForSelectListFailed();
      }
    } else {
      // specialitiesListFailed();
    }
  };
  useEffect(() => {
    getEstablishmentList();
    // getSpecialitiesList();
    // getProfessionsList();
  }, [
    getEstablishmentList,
    // getSpecialitiesList,
    // getProfessionsList
  ]);
  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">Edit Department</h4>
      </div>
      {departmentDetail && departmentDetail?.name ? (
        <Formik
          initialValues={initialState}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={true}
          enableReinitialize={true}
          validationSchema={AddDepartmentValidator}
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
                        }}
                      >
                        Select Establishment
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <Field
                        label="Select Establishment"
                        name="establishment_id"
                        type="select"
                        options={establishmentForSelectList?.map((data) => ({
                          title: data.name,
                          value: data.id,
                        }))}
                        component={FormikSelect}
                      />
                      <ErrorMessage
                        name="establishment_id"
                        component={ShowInputError}
                      />
                    </Grid>
                    {/* <Grid item lg={6}>
                      <Field
                        name="professions"
                        label="Select Professions"
                        value={props.values.professions}
                        onInputChange={onSearchProfessionChange}
                        component={FormikAutocomplete}
                        placeholder="Search by name"
                        options={professionsForSelectList}
                        getOptionLabel={(option) =>
                          option?.first_name + " " + option.last_name
                        }
                        textFieldProps={{
                          fullWidth: true,
                          margin: "normal",
                          variant: "outlined",
                        }}
                        multiple
                      />

                      <ErrorMessage
                        name="professions"
                        component={ShowInputError}
                      />
                    </Grid> */}
                    <Grid item lg={6}>
                      <Field
                        name="specialities"
                        label="Select Specialities"
                        value={props.values.specialities}
                        onInputChange={onSearchSpecialityChange}
                        component={FormikAutocomplete}
                        placeholder="Search by speciality name"
                        options={specialitiesList}
                        getOptionLabel={(option) => option?.name}
                        textFieldProps={{
                          fullWidth: true,
                          margin: "normal",
                          variant: "outlined",
                        }}
                        multiple
                      />
                      <ErrorMessage
                        name="specialities"
                        component={ShowInputError}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <Typography
                        style={{
                          marginBottom: "11px",
                          color: "rgb(30, 30, 30)",
                          fontSize: "16px",
                          lineHeight: "24px",
                        }}
                      >
                        Department Images
                      </Typography>
                      <input
                        name="images"
                        fullWidth
                        type="file"
                        label="second img"
                        multiple
                        style={{
                          padding: "10px",
                          color: "#255480",
                          border: "1px solid",
                          width: "92%",
                          borderRadius: "5px",
                        }}
                        onChange={(event) => {
                          props.setFieldValue(
                            "images",
                            event.currentTarget.files[0]
                          );
                        }}
                      />

                      <ErrorMessage name="images" component={ShowInputError} />
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
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  establishmentForSelectList: state.establishment.establishmentForSelectList,
  departmentDetail: state.department.departmentDetail,
  specialitiesList: state.common.specialitiesList,
  professionsForSelectList: state.profession.professionsForSelectList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    establishmentSelectListSuccess: (data) =>
      dispatch(establishmentSelectListSuccess(data)),
    establishmentSelectListFailed: () =>
      dispatch(establishmentSelectListFailed()),
    departmentDetailSuccess: (data) => dispatch(departmentDetailSuccess(data)),
    departmentDetailFailed: () => dispatch(departmentDetailFailed()),
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
    professionsForSelectListSuccess: (data) =>
      dispatch(professionsForSelectListSuccess(data)),
    professionsForSelectListFailed: () =>
      dispatch(professionsForSelectListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDepartment);
