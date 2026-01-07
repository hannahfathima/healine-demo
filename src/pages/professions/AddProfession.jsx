import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import imageCompression from 'browser-image-compression';
import { ErrorMessage, Field, Formik, FieldArray } from "formik";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import { AddProfessionValidator } from "../../shared/validations/CommonValidations";
import { connect } from "react-redux";
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber } from 'react-phone-number-input';

import 'react-phone-number-input/style.css'; // Import default styles
import { MenuItem } from "@mui/material";

import {
  languagesData,
  monthListData,
  servicesData,
  specialitiesData,
} from "../../utils/jsonData";
import {
  establishmentListSuccess,
  languagesListFailed,
  languagesListSuccess,
  professionTypesListFailed,
  professionTypesListSuccess,
  servicesListFailed,
  servicesListSuccess,
  specialitiesListFailed,
  specialitiesListSuccess,
  nationalitiesListForSelectSuccess,
  nationalitiesListForSelectFailed,
} from "../../store/reducers/commonSlice";
import {
  createRecord,
  fetchList,
  getRecord,
} from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { toast } from "react-toastify";
import { Routing } from "../../shared/constants/routing";
import { DisplayFormikState, getYearList } from "../../utils/helper";
import FormikAutocomplete from "../../components/Formik/FormikAutocomplete";
import {
  establishmentSelectListFailed,
  establishmentSelectListSuccess,
} from "../../store/reducers/establishmentSlice";

function AddProfession(props) {
  const navigate = useNavigate();
  const {
    languagesList,
    servicesList,
    professionTypesList,
    specialitiesList,
    languagesListSuccess,
    languagesListFailed,
    servicesListSuccess,
    servicesListFailed,
    professionTypesListSuccess,
    professionTypesListFailed,
    specialitiesListSuccess,
    specialitiesListFailed,
    establishmentForSelectList,
    establishmentSelectListSuccess,
    establishmentSelectListFailed,
    nationalitiesListForSelect,
    nationalitiesListForSelectSuccess,
    nationalitiesListForSelectFailed,
  } = props;
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  const initialState = {
    licence_no: "",
    surnametype: "", // Add surname type field
    first_name: "", // Initialize with "Dr "
    last_name: "",
    // specialist: "",
    designation: "",
    photo: null,
    email: "",
    phone: "",
    educational_qualification: "",
    expert_in: "",
    // working_since_month: "",
    working_since_year: "",
    healineVerified: true,
    recommended: true,
    profession_type_id: "",
    nationality_id: "",
    specialities: [],
    languages: [],
    services: [],
    place_of_work: [],
    gender: "",
    consultation_fees: "",
    latitude: "",
    longitude: "",
    about: "",
    topRated: false, // Add topRated
    mobile_country_code: '', // New field for mobile country code
    topRatedTitle: "", // Add topRatedTitle
    available: true,
    online_consultation: false,
    working_hours: daysOfWeek.map((day) => ({
      day_of_week: day,
      sessions: [{ start_time: "", end_time: "" }],
    })),
  };
  // const handleSubmit = async (values) => {
  //   console.log(values);
  //   let formData = new FormData();
  //   formData.append("licence_no", values.licence_no);
  //   const prefixedFirstName = `Dr. ${values.first_name.trim()}`;
  //   formData.append("first_name", prefixedFirstName); // Use prefixed first name
  //   formData.append("last_name", values.last_name);
  //   // formData.append("specialist", values.specialist);
  //   formData.append("designation", values.designation);
  //   formData.append("photo", values.photo);
  //   formData.append("email", values.email);
  //   formData.append("phone", values.phone);
  //   formData.append(
  //     "educational_qualification",
  //     values.educational_qualification
  //   );
  //   formData.append("expert_in", values.expert_in);
  //   // formData.append(
  //   //   "working_since_month",
  //   //   parseInt(values.working_since_month)
  //   // );
  //   formData.append("working_since_year", values.working_since_year);
  //   formData.append("profession_type_id", values.profession_type_id);
  //   formData.append("nationality_id", values.nationality_id);
  //   formData.append("consultation_fees", values.consultation_fees || "");
  //   formData.append("about", values.about);

  //   formData.append("latitude", values.latitude || "");
  //   formData.append("longitude", values.longitude || "");
  //   formData.append("gender", values.gender || "");
  //   formData.append("available", values.available ? "true" : "false");
  //   formData.append("personal_visit_only", values.personal_visit_only ? "true" : "false");
  //   formData.append("healineVerified", values.healineVerified ? "true" : "false");
  //   formData.append("recommended", values.recommended ? "true" : "false");
  //   formData.append("topRated", values.topRated ? "true" : "false"); // Add topRated
  //   formData.append("topRatedTitle", values.topRated ? values.topRatedTitle : ""); // Add topRatedTitle, empty if not topRated
  //   values.languages.forEach((element, key) => {
  //     formData.append(`languages[${key}]`, element.id);
  //   });
  //   values.specialities.forEach((element, key) => {
  //     formData.append(`specialities[${key}]`, element.id);
  //   });
  //   values.services.forEach((element, key) => {
  //     formData.append(`services[${key}]`, element.id);
  //   });
  //   values.place_of_work.forEach((element, key) => {
  //     formData.append(`place_of_work[${key}]`, element.id);
  //   });

  //   values.working_hours = values.working_hours.map((day) => {
  //     const hasValidSessions = day.sessions.some(
  //       (s) => s.start_time && s.end_time
  //     );
  //     return {
  //       ...day,
  //       sessions: hasValidSessions ? day.sessions : [],
  //       is_leave: !hasValidSessions
  //     };
  //   });
  //   values.working_hours.forEach((day, dIdx) => {
  //     formData.append(`working_hours[${dIdx}][day_of_week]`, day.day_of_week);
  //     formData.append(`working_hours[${dIdx}][is_leave]`, day.is_leave);
  //     day.sessions.forEach((s, sIdx) => {
  //       formData.append(`working_hours[${dIdx}][sessions][${sIdx}][start_time]`, s.start_time);
  //       formData.append(`working_hours[${dIdx}][sessions][${sIdx}][end_time]`, s.end_time);
  //     });
  //   });

  //   const result = await createRecord(
  //     formData,
  //     ApiEndPoints.PROFESSION_RESOURCE_ROUTE
  //   );
  //   if (result.status === 200) {
  //     toast.success(result.message);
  //     navigate(Routing.Professionals);
  //   } else {
  //     toast.error(result.message);
  //   }
  // };

  // const getServicesList = useCallback(async () => {
  //   const result = await fetchList(ApiEndPoints.GET_SERVICES_FOR_SELECT);
  //   if (result.status === 200) {
  //     servicesListSuccess(result.data);
  //   } else {
  //     servicesListFailed();
  //   }
  // }, []);


  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    let formData = new FormData();

    // Append fields only if they have valid values
    if (values.licence_no) formData.append("licence_no", values.licence_no);
    // if (values.first_name) {
    //   const prefixedFirstName = `Dr. ${values.first_name.trim()}`;
    //   formData.append("first_name", prefixedFirstName);
    // }
    // Remove the prefixedFirstName logic
    if (values.surnametype) formData.append("surnametype", values.surnametype);
    if (values.first_name) formData.append("first_name", values.first_name.trim());
    if (values.last_name) formData.append("last_name", values.last_name);
    if (values.designation) formData.append("designation", values.designation);
    if (values.photo) formData.append("photo", values.photo);
    if (values.email) formData.append("email", values.email);
    if (values.mobile_country_code) formData.append("mobile_country_code", values.mobile_country_code);
    if (values.phone) formData.append("phone", values.phone);
    if (values.educational_qualification)
      formData.append("educational_qualification", values.educational_qualification);
    if (values.expert_in) formData.append("expert_in", values.expert_in);
    if (values.working_since_year)
      formData.append("working_since_year", values.working_since_year);
    if (values.profession_type_id)
      formData.append("profession_type_id", values.profession_type_id);
    if (values.nationality_id) formData.append("nationality_id", values.nationality_id);
    if (values.consultation_fees)
      formData.append("consultation_fees", values.consultation_fees);
    if (values.about) formData.append("about", values.about);
    if (values.latitude) formData.append("latitude", values.latitude);
    if (values.longitude) formData.append("longitude", values.longitude);
    if (values.gender) formData.append("gender", values.gender);
    formData.append("available", values.available ? "true" : "false");
    formData.append("online_consultation", values.online_consultation ? "true" : "false");
    formData.append("healineVerified", values.healineVerified ? "true" : "false");
    formData.append("recommended", values.recommended ? "true" : "false");
    formData.append("topRated", values.topRated ? "true" : "false");
    if (values.topRated && values.topRatedTitle)
      formData.append("topRatedTitle", values.topRatedTitle);

    // Append array fields only if they contain valid items
    if (values.languages?.length) {
      values.languages.forEach((element, key) => {
        if (element?.id) formData.append(`languages[${key}]`, element.id);
      });
    }
    if (values.specialities?.length) {
      values.specialities.forEach((element, key) => {
        if (element?.id) formData.append(`specialities[${key}]`, element.id);
      });
    }
    if (values.services?.length) {
      values.services.forEach((element, key) => {
        if (element?.id) formData.append(`services[${key}]`, element.id);
      });
    }
    if (values.place_of_work?.length) {
      values.place_of_work.forEach((element, key) => {
        if (element?.id) formData.append(`place_of_work[${key}]`, element.id);
      });
    }

    // Handle working hours
    if (values.working_hours?.length) {
      values.working_hours = values.working_hours.map((day) => {
        const hasValidSessions = day.sessions?.some(
          (s) => s.start_time && s.end_time
        );
        return {
          ...day,
          sessions: hasValidSessions ? day.sessions : [],
          is_leave: !hasValidSessions,
        };
      });
      values.working_hours.forEach((day, dIdx) => {
        if (day.day_of_week) {
          formData.append(`working_hours[${dIdx}][day_of_week]`, day.day_of_week);
          formData.append(`working_hours[${dIdx}][is_leave]`, day.is_leave ? "true" : "false");
          if (day.sessions?.length) {
            day.sessions.forEach((s, sIdx) => {
              if (s.start_time && s.end_time) {
                formData.append(
                  `working_hours[${dIdx}][sessions][${sIdx}][start_time]`,
                  s.start_time
                );
                formData.append(
                  `working_hours[${dIdx}][sessions][${sIdx}][end_time]`,
                  s.end_time
                );
              }
            });
          }
        }
      });
    }

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    try {
      const result = await createRecord(
        formData,
        ApiEndPoints.PROFESSION_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        toast.success(result.message);
        navigate(Routing.Professionals);
      } else {
        toast.error(
          result?.data?.message ||
          Object.values(result?.data?.data || {}).join(", ") ||
          result.message ||
          "Failed to create profession"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
        Object.values(error.response?.data?.data || {}).join(", ") ||
        "An error occurred during submission"
      );
    }
  };
  const getProfessionTypesList = useCallback(async () => {
    const result = await fetchList(
      ApiEndPoints.GET_PROFESSION_TYPES_FOR_SELECT
    );
    if (result.status === 200) {
      professionTypesListSuccess(result.data);
    } else {
      professionTypesListFailed();
    }
  }, []);
  const getNationalitiesList = useCallback(async () => {
    const result = await fetchList(
      ApiEndPoints.NATIONALITIES_RESOURCE_ROUTE +
      "/get_nationalities_for_select"
    );
    if (result.status === 200) {
      nationalitiesListForSelectSuccess(result.data);
    } else {
      nationalitiesListForSelectFailed();
    }
  }, []);
  /*const getSpecialitiesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_SPECIALITIES_FOR_SELECT);
    if (result.status === 200) {
      specialitiesListSuccess(result.data);
    } else {
      specialitiesListFailed();
    }
  }, []);*/

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
  const onSearchLanguageChange = async (event) => {
    const { value } = event.target;
    if (value) {
      const result = await fetchList(
        ApiEndPoints.GET_LANGUAGES_FOR_SELECT + `?search_text=${value}`
      );
      if (result.status === 200) {
        languagesListSuccess(result.data);
      } else {
        languagesListFailed();
      }
    } else {
      // languagesListFailed();
    }
  };
  const onSearchServiceChange = async (event) => {
    const { value } = event.target;
    if (value) {
      const result = await fetchList(
        ApiEndPoints.GET_SERVICES_FOR_SELECT + `?search_text=${value}`
      );
      if (result.status === 200) {
        servicesListSuccess(result.data);
      } else {
        servicesListFailed();
      }
    } else {
      // servicesListFailed();
    }
  };
  const onSearchPlaceOfWorkChange = async (event) => {
    const { value } = event.target;
    if (value) {
      const result = await fetchList(
        ApiEndPoints.GET_ESTABLISHMENT_FOR_SELECT + `?search_text=${value}&search_field=last_name`
      );
      if (result.status === 200) {
        establishmentSelectListSuccess(result.data);
      } else {
        establishmentSelectListFailed();
      }
    } else {
      establishmentSelectListFailed();
    }
  };

  // const getLanguagesList = useCallback(async () => {
  //   const result = await fetchList(ApiEndPoints.GET_LANGUAGES_FOR_SELECT);
  //   if (result.status === 200) {
  //     languagesListSuccess(result.data);
  //   } else {
  //     languagesListFailed();
  //   }
  // }, []);
  useEffect(() => {
    getProfessionTypesList();
    getNationalitiesList();
    // getSpecialitiesList();
    // getLanguagesList();
    // getServicesList();
  }, [
    getProfessionTypesList,
    getNationalitiesList,
    // getSpecialitiesList,
    // getLanguagesList,
    // getServicesList,
  ]);

  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">Add Professionals</h4>
      </div>
      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={true}
        enableReinitialize={true}
        validationSchema={AddProfessionValidator}
      >
        {(props) => {
          const { handleSubmit, values, setFieldValue } = props;

          return (
            <>
              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2} alignItems="flex-start">

                  <Grid item lg={2}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Surname Type <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      name="surnametype"
                      label="Select Surname Type"
                      select
                      as={TextField}
                      fullWidth
                    >
                      {["Dr.", "Mr.", "Mrs.", "Ms."].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name="surnametype" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="First Name"
                      required
                      name="first_name"
                      placeHolder="First name"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage name="first_name" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="Last Name"
                      required
                      name="last_name"
                      placeHolder="Last name"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage name="last_name" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="Email"
                      name="email"
                      placeHolder="Email"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage name="email" component={ShowInputError} />
                  </Grid>
                  {/* // Then replace the PhoneInput section with: */}
                  <Grid item lg={4}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Phone <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="US"
                      value={
                        props.values.mobile_country_code && props.values.phone
                          ? `${props.values.mobile_country_code}${props.values.phone}`
                          : ''
                      }
                      onChange={(value) => {
                        if (value) {
                          try {
                            const phoneNumber = parsePhoneNumber(value);
                            if (phoneNumber) {
                              const countryCode = `+${phoneNumber.countryCallingCode}`;
                              const nationalNumber = phoneNumber.nationalNumber;

                              console.log('Country Code:', countryCode); // e.g., "+91"
                              console.log('Phone Number:', nationalNumber); // e.g., "8888888"

                              props.setFieldValue('mobile_country_code', countryCode);
                              props.setFieldValue('phone', nationalNumber);
                            }
                          } catch (error) {
                            console.error('Error parsing phone number:', error);
                            props.setFieldValue('mobile_country_code', '');
                            props.setFieldValue('phone', value);
                          }
                        } else {
                          props.setFieldValue('mobile_country_code', '');
                          props.setFieldValue('phone', '');
                        }
                      }}
                      placeholder="Enter phone number"
                      style={{
                        border: '1px solid #696969ff',
                        borderRadius: '4px',
                        padding: '0px 8px',
                        width: '100%'
                      }}
                    />
                    <ErrorMessage name="mobile_country_code" component={ShowInputError} />
                    <ErrorMessage name="phone" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="License Number"
                      name="licence_no"
                      placeHolder="License Number"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage
                      name="licence_no"
                      component={ShowInputError}
                    />
                  </Grid>
                  {/* <Grid item lg={4}>
                    <Field
                      label="Specialist"
                      required
                      name="specialist"
                      placeHolder="Specialist"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage
                      name="specialist"
                      component={ShowInputError}
                    />
                  </Grid> */}
                  <Grid item lg={4}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Nationality
                    </Typography>
                    <Field
                      label="Select Nationality"
                      name="nationality_id"
                      type="select"
                      options={nationalitiesListForSelect?.map((data) => ({
                        title: (
                          <>
                            <img
                              src={data.icon}
                              alt={data.label}
                              style={{ width: 20, height: 20, marginRight: 10 }}
                            />{" "}
                            {data.name}
                          </>
                        ),
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    />

                    <ErrorMessage
                      name="nationality_id"
                      component={ShowInputError}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="Designation"
                      name="designation"
                      placeHolder="Designation"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage
                      name="designation"
                      component={ShowInputError}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Photo
                    </Typography>
                    <TextField
                      fullWidth
                      name="photo"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={async (event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                            toast.error('Invalid file type. Only JPG and PNG files are allowed.');
                            return;
                          }
                          try {
                            const options = {
                              maxSizeMB: 1, // Compress to max 1MB (adjust as needed)
                              maxWidthOrHeight: 1920,
                              useWebWorker: true,
                              initialQuality: 0.85
                            };
                            const compressedFile = await imageCompression(file, options);
                            const finalFile = new File([compressedFile], file.name, {
                              type: file.type,
                              lastModified: Date.now(),
                            });
                            props.setFieldValue('photo', finalFile);
                          } catch (compressError) {
                            console.error('Compression error:', compressError);
                            toast.error('Failed to compress image.');
                          }
                        }
                      }}
                    />
                    <ErrorMessage name="photo" component={ShowInputError} />
                  </Grid>

                  {/* <Grid item lg={4}>
                    <Field
                      label="Photo"
                      type="file"
                      name="photo"
                      placeHolder="Photo"
                      onChange={(event) => {
                        props.setFieldValue(
                          "photo",
                          event.currentTarget.files[0]
                        );
                      }}
                      component={FormikInput}
                    />
                    <ErrorMessage name="photo" component={ShowInputError} />
                  </Grid> */}
                  <Grid item lg={4}>
                    <Field
                      label="Educational Qualification"
                      name="educational_qualification"
                      placeHolder="Educational Qualification"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage
                      name="educational_qualification"
                      component={ShowInputError}
                    />
                  </Grid>
                  {/* <Grid item lg={4}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Working Since Month{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select Working Since Month"
                      name="working_since_month"
                      type="select"
                      options={monthListData?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    />
                    <ErrorMessage
                      name="working_since_month"
                      component={ShowInputError}
                    />
                  </Grid> */}
                  <Grid item lg={4}>
                    <Field
                      label="Years of experience"
                      // type="number"
                      // required
                      name="working_since_year"
                      placeHolder="Years of experience"
                      // maxLength={150}
                      component={FormikInput}
                    />
                    {/* <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Working Since Year{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select Working Since Year"
                      name="working_since_year"
                      type="select"
                      options={getYearList()?.map((data, index) => ({
                        title: data,
                        value: data,
                      }))}
                      component={FormikSelect}
                    /> */}

                    <ErrorMessage
                      name="working_since_year"
                      component={ShowInputError}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Profession Type{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select Profession Type"
                      name="profession_type_id"
                      type="select"
                      options={professionTypesList?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    />

                    <ErrorMessage
                      name="profession_type_id"
                      component={ShowInputError}
                    />
                  </Grid>
                  {/* <Grid item lg={4}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Specialities
                    </Typography>
                    <Field
                      label="Select Specialities"
                      name="specialities"
                      multiple
                      type="select"
                      options={specialitiesList?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    />

                    <ErrorMessage
                      name="specialities"
                      component={ShowInputError}
                    />
                  </Grid> */}
                  <Grid item lg={4}>
                    <Field
                      name="specialities"
                      label="Select Specialities"
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

                    {/* <FormControl fullWidth>
                      <Autocomplete
                        id="combo-box-demo"
                        options={specialitiesList}
                        name="specialities"
                        // onInputChange={onSearchInputChange}
                        multiple
                        // onChange={(event, value) => handleUserSelected(value)}
                        getOptionLabel={(option) => option?.name}
                        // PaperComponent={CustomPaper}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search by speciality name"
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl> */}

                    <ErrorMessage
                      name="specialities"
                      component={ShowInputError}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    {/* <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Languages <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select Languages"
                      name="languages"
                      multiple
                      type="select"
                      options={languagesList?.map((data) => ({
                        title: data.language,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    /> */}

                    <Field
                      name="languages"
                      required
                      label="Select Languages"
                      onInputChange={onSearchLanguageChange}
                      component={FormikAutocomplete}
                      placeholder="Search by langauge"
                      options={languagesList}
                      getOptionLabel={(option) => option?.language}
                      textFieldProps={{
                        fullWidth: true,
                        margin: "normal",
                        variant: "outlined",
                      }}
                      multiple
                    />

                    <ErrorMessage name="languages" component={ShowInputError} />
                  </Grid>
                  {/* <Grid item lg={4}>
                    {/* <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Services
                    </Typography>
                    <Field
                      label="Select Services"
                      name="services"
                      multiple
                      type="select"
                      options={servicesList?.map((data) => ({
                        title: data.service,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    /> 
                    <Field
                      name="services"
                      label="Expert In"
                      onInputChange={onSearchServiceChange}
                      component={FormikAutocomplete}
                      placeholder="Search by expert in"
                      options={servicesList}
                      getOptionLabel={(option) => option?.service}
                      textFieldProps={{
                        fullWidth: true,
                        margin: "normal",
                        variant: "outlined",
                      }}
                      multiple
                    />
                    <ErrorMessage name="services" component={ShowInputError} />
                  </Grid> */}

                  <Grid item lg={4}>
                    <Field
                      label="Expert In"
                      name="expert_in"
                      placeHolder="Expert In"
                      component={FormikInput}
                    />
                    {/* <ErrorMessage name="expert_in" component={ShowInputError} /> */}
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      name="place_of_work"
                      label="Select Place Of Work"
                      onInputChange={onSearchPlaceOfWorkChange}
                      component={FormikAutocomplete}
                      placeholder="Search by place of work"
                      options={establishmentForSelectList}
                      getOptionLabel={(option) => option?.name}
                      textFieldProps={{
                        fullWidth: true,
                        margin: "normal",
                        variant: "outlined",
                      }}
                      multiple
                    />
                    <ErrorMessage
                      name="place_of_work"
                      component={ShowInputError}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="About"
                      name="about"
                      placeHolder="About"
                      component={FormikInput}
                      multiline
                      rows={4}
                    />
                    <ErrorMessage name="about" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field label="Consultation Fees" name="consultation_fees" component={FormikInput} />
                  </Grid>
                  {/* <Grid item lg={4}>
                    <Field label="Latitude" name="latitude" component={FormikInput} />
                  </Grid> */}
                  {/* <Grid item lg={4}>
                    <Field label="Longitude" name="longitude" component={FormikInput} />
                  </Grid> */}
                  <Grid item lg={4}>
                    <Typography
                      style={{
                        marginBottom: "11px",
                        color: "rgb(30, 30, 30)",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 500,
                      }}
                    >
                      Select Gender <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      name="gender"
                      label="Select Gender"
                      select
                      as={TextField}
                      fullWidth
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Field>
                    <ErrorMessage name="gender" component={ShowInputError} />
                  </Grid>

                  {/* / Add form fields for topRated and topRatedTitle (place after the existing checkboxes for healineVerified and recommended, around line 550 in the Grid container) */}
                  <Grid item lg={3}>
                    <label>
                      <Field type="checkbox" name="healineVerified" />
                      {" "}Healine Verified
                    </label>
                  </Grid>
                  <Grid item lg={3}>
                    <label>
                      <Field type="checkbox" name="recommended" />
                      {" "}Recommended
                    </label>
                  </Grid>


                  <Grid item lg={3}>
                    <label>
                      <Field type="checkbox" name="online_consultation" />
                      {" "}Online Consultation
                    </label>
                  </Grid>
                  <Grid item lg={3}>
                    <label>
                      <Field type="checkbox" name="available" />
                      {" "}Available
                    </label>
                  </Grid>
                  <Grid item lg={1}>
                    <label>
                      <Field type="checkbox" name="topRated" />
                      {" "}Top Rated
                    </label>
                  </Grid>
                  <Grid item lg={3}>
                    {props.values.topRated && (
                      <Field
                        label=""
                        name="topRatedTitle"
                        placeHolder="Enter Top Rated Title"
                        maxLength={255}
                        component={FormikInput}
                      />
                    )}
                    <ErrorMessage name="topRatedTitle" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={12}>
                    <Typography variant="h6">Consultation Timings (Multiple Sessions per Day)</Typography>
                  </Grid>
                  <FieldArray name="working_hours">
                    {() =>
                      values.working_hours.map((day, dIdx) => (
                        <Grid item lg={12} key={dIdx}>
                          <Typography variant="subtitle1" style={{ marginTop: '10px' }}>{day.day_of_week}</Typography>
                          <FieldArray name={`working_hours[${dIdx}].sessions`}>
                            {({ push, remove }) => (
                              <>
                                {day.sessions.map((session, sIdx) => (
                                  <Grid container spacing={2} key={sIdx}>
                                    <Grid item lg={3}>
                                      <Field
                                        name={`working_hours[${dIdx}].sessions[${sIdx}].start_time`}
                                        label="Start Time"
                                        type="time"
                                        component={FormikInput}
                                      />
                                    </Grid>
                                    <Grid item lg={3}>
                                      <Field
                                        name={`working_hours[${dIdx}].sessions[${sIdx}].end_time`}
                                        label="End Time"
                                        type="time"
                                        component={FormikInput}
                                      />
                                    </Grid>
                                    <Grid item lg={2}>
                                      {day.sessions.length > 1 && (
                                        <Button onClick={() => remove(sIdx)} color="secondary">Remove</Button>
                                      )}
                                    </Grid>
                                  </Grid>
                                ))}
                                <Button onClick={() => push({ start_time: "", end_time: "" })} variant="outlined" size="small">
                                  Add Session
                                </Button>
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                      ))
                    }
                  </FieldArray>

                </Grid>
                {/* <Grid container className="mt-2">
                  <Grid container>
                    <Grid item lg={12}>
                      <Typography
                        style={{
                          marginBottom: "10px",
                          // marginTop: "25px",
                          color: "#000",
                          fontSize: "20px",
                          lineHeight: "24px",
                          fontWeight: 700,
                        }}
                      >
                        Specialities
                      </Typography>
                    </Grid>
                  </Grid>
                  {specialitiesData.map((innerItem, idx) => {
                    return (
                      <>
                        <Grid item lg={2} key={idx}>
                          <label>
                            <Field
                              className="solo-check"
                              name="room_facilities"
                              id="room_facilities"
                              type="checkbox"
                              value={innerItem.id}
                              label={innerItem.name}
                              onChange={(event) => {
                                var index =
                                  props.values.room_facilities.indexOf(
                                    event.target.value
                                  );
                                if (index === -1) {
                                  props.values.room_facilities.push(
                                    event.target.value
                                  );
                                } else {
                                  props.values.room_facilities.splice(index, 1);
                                }
                              }}
                              component={Checkbox}
                            />
                            {innerItem.name}
                          </label>
                        </Grid>
                      </>
                    );
                  })}
                </Grid> */}
                {/* <Grid container className="mt-2">
                  <Grid container>
                    <Grid item lg={12}>
                      <Typography
                        style={{
                          marginBottom: "10px",
                          // marginTop: "25px",
                          color: "#000",
                          fontSize: "20px",
                          lineHeight: "24px",
                          fontWeight: 700,
                        }}
                      >
                        Languages
                      </Typography>
                    </Grid>
                  </Grid>
                  {languagesData.map((innerItem, idx) => {
                    return (
                      <>
                        <Grid item lg={2} key={idx}>
                          <label>
                            <Field
                              className="solo-check"
                              name="room_facilities"
                              id="room_facilities"
                              type="checkbox"
                              value={innerItem.id}
                              label={innerItem.language}
                              onChange={(event) => {
                                var index =
                                  props.values.room_facilities.indexOf(
                                    event.target.value
                                  );
                                if (index === -1) {
                                  props.values.room_facilities.push(
                                    event.target.value
                                  );
                                } else {
                                  props.values.room_facilities.splice(index, 1);
                                }
                              }}
                              component={Checkbox}
                            />
                            {innerItem.language}
                          </label>
                        </Grid>
                      </>
                    );
                  })}
                </Grid> */}
                {/* <Grid container className="mt-2">
                  <Grid container>
                    <Grid item lg={12}>
                      <Typography
                        style={{
                          marginBottom: "10px",
                          // marginTop: "25px",
                          color: "#000",
                          fontSize: "20px",
                          lineHeight: "24px",
                          fontWeight: 700,
                        }}
                      >
                        Services
                      </Typography>
                    </Grid>
                  </Grid>
                  {servicesData.map((innerItem, idx) => {
                    return (
                      <>
                        <Grid item lg={2} key={idx}>
                          <label>
                            <Field
                              className="solo-check"
                              name="room_facilities"
                              id="room_facilities"
                              type="checkbox"
                              value={innerItem.id}
                              label={innerItem.service}
                              onChange={(event) => {
                                var index =
                                  props.values.room_facilities.indexOf(
                                    event.target.value
                                  );
                                if (index === -1) {
                                  props.values.room_facilities.push(
                                    event.target.value
                                  );
                                } else {
                                  props.values.room_facilities.splice(index, 1);
                                }
                              }}
                              component={Checkbox}
                            />
                            {innerItem.service}
                          </label>
                        </Grid>
                      </>
                    );
                  })}
                </Grid> */}
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
                  {/* <pre>{JSON.stringify(props.errors, null, 2)}</pre> */}

                </div>
                {/* <DisplayFormikState {...props} /> */}
              </form>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

const mapStateToProps = (state) => ({
  languagesList: state.common.languagesList,
  servicesList: state.common.servicesList,
  establishmentForSelectList: state.establishment.establishmentForSelectList,
  professionTypesList: state.common.professionTypesList,
  nationalitiesListForSelect: state.common.nationalitiesListForSelect,
  specialitiesList: state.common.specialitiesList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    languagesListSuccess: (data) => dispatch(languagesListSuccess(data)),
    languagesListFailed: () => dispatch(languagesListFailed()),
    servicesListSuccess: (data) => dispatch(servicesListSuccess(data)),
    servicesListFailed: () => dispatch(servicesListFailed()),
    establishmentSelectListSuccess: (data) =>
      dispatch(establishmentSelectListSuccess(data)),
    establishmentSelectListFailed: () =>
      dispatch(establishmentSelectListFailed()),
    professionTypesListSuccess: (data) =>
      dispatch(professionTypesListSuccess(data)),
    professionTypesListFailed: () => dispatch(professionTypesListFailed()),
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
    nationalitiesListForSelectSuccess: (data) =>
      dispatch(nationalitiesListForSelectSuccess(data)),
    nationalitiesListForSelectFailed: () =>
      dispatch(nationalitiesListForSelectFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProfession);