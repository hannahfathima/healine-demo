import { Button, Checkbox, Grid, TextField, Typography, Select, ListItemText } from "@mui/material";
import { ErrorMessage, Field, Formik, FieldArray } from "formik";
import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import { AddProfessionValidator } from "../../shared/validations/CommonValidations";
import { connect } from "react-redux";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import imageCompression from 'browser-image-compression';
import { MenuItem } from "@mui/material";
import { parsePhoneNumber } from 'react-phone-number-input';
import {
  languagesData,
  monthListData,
  servicesData,
  specialitiesData,
} from "../../utils/jsonData";
import {
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
  updateRecord,
} from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { toast } from "react-toastify";
import { Routing } from "../../shared/constants/routing";
import {
  professionsDetailFailed,
  professionsDetailSuccess,
} from "../../store/reducers/professionSlice";
import { DisplayFormikState, getYearList } from "../../utils/helper";
import FormikAutocomplete from "../../components/Formik/FormikAutocomplete";
import {
  establishmentSelectListFailed,
  establishmentSelectListSuccess,
} from "../../store/reducers/establishmentSlice";

function EditProfession(props) {
  let { professionId } = useParams();

  const navigate = useNavigate();

  const {
    languagesList,
    servicesList,
    professionTypesList,
    specialitiesList,
    professionDetail,
    languagesListSuccess,
    languagesListFailed,
    servicesListSuccess,
    servicesListFailed,
    professionTypesListSuccess,
    professionTypesListFailed,
    specialitiesListSuccess,
    specialitiesListFailed,
    professionsDetailSuccess,
    professionsDetailFailed,
    establishmentForSelectList,
    establishmentSelectListSuccess,
    establishmentSelectListFailed,
    nationalitiesListForSelect,
    nationalitiesListForSelectSuccess,
    nationalitiesListForSelectFailed,
  } = props;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const specFromApi = professionDetail?.specialitiesList.map((item) => item.speciality_id) || [];
  const langFromApi = professionDetail?.languagesList.map((item) => item.language_id) || [];
  const serviceFromApi = professionDetail?.servicesList.map((item) => item.service_id) || [];
  const placeOfWorkFromApi = professionDetail?.professionsEstablishmentList.map((item) => item.establishment_id) || [];

  const initialState = {
    licence_no: professionDetail?.licence_no,
    surnametype: professionDetail?.surnametype || "",
    first_name: professionDetail?.first_name,
    last_name: professionDetail?.last_name,
    designation: professionDetail?.designation,
    photo: null,
    email: professionDetail?.email,
    mobile_country_code: professionDetail?.mobile_country_code || "",
    phone: professionDetail?.phone || "",
    educational_qualification: professionDetail?.educational_qualification,
    expert_in: professionDetail?.expert_in,
    working_since_year: professionDetail?.working_since_year,
    profession_type_id: professionDetail?.profession_type_id,
    nationality_id: professionDetail?.nationality_id,
    specialities: specFromApi || [],
    languages: langFromApi || [],
    services: serviceFromApi || [],
    place_of_work: placeOfWorkFromApi || [],
    consultation_fees: professionDetail?.consultation_fees || "",
    latitude: professionDetail?.latitude || "",
    longitude: professionDetail?.longitude || "",
    recommended: professionDetail?.recommended || false,
    healineVerified: professionDetail?.healineVerified || false,
    gender: professionDetail?.gender || "",
    available: professionDetail?.available || false,
    about: professionDetail?.about || "",
    topRated: professionDetail?.topRated || false,
    topRatedTitle: professionDetail?.topRatedTitle || "",
    online_consultation: professionDetail?.online_consultation || false,
    working_hours: dayNames.map((day, index) => {
      const match = professionDetail?.working_hours?.find(
        (wh) => parseInt(wh.day_of_week) === index
      );

      const start = match?.start_time && match.start_time !== "00:00:00" ? match.start_time.slice(0, 5) : "";
      const end = match?.end_time && match.end_time !== "00:00:00" ? match.end_time.slice(0, 5) : "";

      return {
        day_of_week: day,
        is_leave: match ? match.is_day_off : true,
        sessions: !match || match.is_day_off
          ? []
          : [{ start_time: start, end_time: end }],
      };
    })
  };
  console.log("initialState", initialState);

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    let formData = new FormData();

    if (values.licence_no) formData.append("licence_no", values.licence_no);
    if (values.surnametype) formData.append("surnametype", values.surnametype);
    if (values.first_name) formData.append("first_name", values.first_name);
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

    if (values.languages?.length) {
      values.languages.forEach((element, key) => {
        if (element) formData.append(`languages[${key}]`, element);
      });
    }
    if (values.specialities?.length) {
      values.specialities.forEach((element, key) => {
        if (element) formData.append(`specialities[${key}]`, element);
      });
    }
    if (values.services?.length) {
      values.services.forEach((element, key) => {
        if (element) formData.append(`services[${key}]`, element);
      });
    }
    if (values.place_of_work?.length) {
      values.place_of_work.forEach((element, key) => {
        if (element) formData.append(`place_of_work[${key}]`, element);
      });
    }

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

    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    try {
      const result = await updateRecord(
        formData,
        professionId,
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
          "Failed to update profession"
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

  const getProfessionDetail = useCallback(
    async (roomCatId) => {
      const result = await getRecord(
        professionId,
        ApiEndPoints.PROFESSION_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        professionsDetailSuccess(result.data);
      } else {
        professionsDetailFailed();
      }
    },
    [professionId]
  );

  useEffect(() => {
    getProfessionDetail(professionId);
  }, [professionId, getProfessionDetail]);

  useEffect(() => {
    console.log("🚀 working_hours from API:", professionDetail?.working_hours);
  }, [professionDetail]);

  const getServicesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_SERVICES_FOR_SELECT);
    if (result.status === 200) {
      servicesListSuccess(result.data);
    } else {
      servicesListFailed();
    }
  }, []);

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

  const getSpecialitiesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_SPECIALITIES_FOR_SELECT);
    if (result.status === 200) {
      specialitiesListSuccess(result.data);
    } else {
      specialitiesListFailed();
    }
  }, []);

  const getLanguagesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_LANGUAGES_FOR_SELECT);
    if (result.status === 200) {
      languagesListSuccess(result.data);
    } else {
      languagesListFailed();
    }
  }, []);

  const getEstablishmentForSelectList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_ESTABLISHMENT_FOR_SELECT);
    if (result.status === 200) {
      establishmentSelectListSuccess(result.data);
    } else {
      establishmentSelectListFailed();
    }
  }, []);

  useEffect(() => {
    getProfessionTypesList();
    getNationalitiesList();
    getSpecialitiesList();
    getLanguagesList();
    getServicesList();
    getEstablishmentForSelectList();
  }, [
    getProfessionTypesList,
    getNationalitiesList,
    getSpecialitiesList,
    getLanguagesList,
    getServicesList,
    getEstablishmentForSelectList,
  ]);

  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">Edit Professionals</h4>
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

          const specAllSelected = props.values.specialities.length === specialitiesList.length;
          const handleSpecialitiesSelectAllToggle = () => {
            props.setFieldValue(
              "specialities",
              specAllSelected ? [] : specialitiesList.map((opt) => opt.id)
            );
          };

          const langAllSelected = props.values.languages.length === languagesList.length;
          const handleLanguagesSelectAllToggle = () => {
            props.setFieldValue(
              "languages",
              langAllSelected ? [] : languagesList.map((opt) => opt.id)
            );
          };

          const placeAllSelected = props.values.place_of_work.length === establishmentForSelectList.length;
          const handlePlaceOfWorkSelectAllToggle = () => {
            props.setFieldValue(
              "place_of_work",
              placeAllSelected ? [] : establishmentForSelectList.map((opt) => opt.id)
            );
          };

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
                          : props.values.phone || ''
                      }
                      onChange={(value) => {
                        if (value) {
                          try {
                            const phoneNumber = parsePhoneNumber(value);
                            if (phoneNumber) {
                              const countryCode = `+${phoneNumber.countryCallingCode}`;
                              const nationalNumber = phoneNumber.nationalNumber;

                              console.log('Country Code:', countryCode);
                              console.log('Phone Number:', nationalNumber);

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
                    <Grid container>
                      <Grid item lg={9}>
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
                      </Grid>
                      <Grid
                        item
                        lg={3}
                        style={{
                          display: "flex",
                          justifyContent: "right",
                          alignItems: "self-end",
                        }}
                      >
                        {professionDetail?.photo && (
                          <img
                            src={professionDetail.photo}
                            alt={professionDetail.name || "Profile Photo"}
                            style={{
                              height: "50px",
                              width: "75px",
                              marginTop: "15px",
                            }}
                          />
                        )}
                      </Grid>
                    </Grid>
                    <ErrorMessage name="photo" component={ShowInputError} />
                  </Grid>
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
                  <Grid item lg={4}>
                    <Field
                      label="Years of experience"
                      name="working_since_year"
                      placeHolder="Years of experience"
                      component={FormikInput}
                    />
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
                      Select Specialities
                    </Typography>
                    <Field
                      name="specialities"
                      value={props.values.specialities}
                      as={Select}
                      multiple
                      fullWidth
                      className="SpecDropdownCheckbox1"
                      renderValue={(selected) =>
                        selected.length === specialitiesList.length
                          ? "All Selected"
                          : selected
                            .map(
                              (id) =>
                                specialitiesList.find(
                                  (opt) => opt.id === id
                                )?.name
                            )
                            .join(", ")
                      }
                    >
                      <MenuItem onClick={handleSpecialitiesSelectAllToggle}>
                        <Checkbox checked={specAllSelected} />
                        <ListItemText
                          primary={
                            specAllSelected ? "Deselect All" : "Select All"
                          }
                        />
                      </MenuItem>
                      {[...specialitiesList]
                        .sort((a, b) => {
                          const aSel = props.values.specialities.includes(a.id);
                          const bSel = props.values.specialities.includes(b.id);
                          return aSel === bSel ? 0 : aSel ? -1 : 1;   // selected → TOP
                        })
                        .map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={props.values.specialities.includes(option.id)} />
                            <ListItemText primary={option.name} />
                          </MenuItem>
                        ))}

                    </Field>
                    <ErrorMessage
                      name="specialities"
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
                      Select Languages <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      name="languages"
                      required
                      value={props.values.languages}
                      as={Select}
                      multiple
                      fullWidth
                      className="SpecDropdownCheckbox1"
                      renderValue={(selected) =>
                        selected.length === languagesList.length
                          ? "All Selected"
                          : selected
                            .map(
                              (id) =>
                                languagesList.find(
                                  (opt) => opt.id === id
                                )?.language
                            )
                            .join(", ")
                      }
                    >
                      <MenuItem onClick={handleLanguagesSelectAllToggle}>
                        <Checkbox checked={langAllSelected} />
                        <ListItemText
                          primary={
                            langAllSelected ? "Deselect All" : "Select All"
                          }
                        />
                      </MenuItem>
                      {[...languagesList]
                        .sort((a, b) => {
                          const aSel = props.values.languages.includes(a.id);
                          const bSel = props.values.languages.includes(b.id);
                          return aSel === bSel ? 0 : aSel ? -1 : 1;
                        })
                        .map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={props.values.languages.includes(option.id)} />
                            <ListItemText primary={option.language} />
                          </MenuItem>
                        ))}

                    </Field>
                    <ErrorMessage name="languages" component={ShowInputError} />
                  </Grid>
                  {/*<Grid item lg={4}>
                    <Typography
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
                  </Grid>*/}
                  <Grid item lg={4}>
                    <Field
                      label="Expert In"
                      name="expert_in"
                      placeHolder="Expert In"
                      component={FormikInput}
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
                      Select Place Of Work
                    </Typography>
                    <Field
                      name="place_of_work"
                      value={props.values.place_of_work}
                      as={Select}
                      multiple
                      fullWidth
                      className="SpecDropdownCheckbox1"
                      renderValue={(selected) =>
                        selected.length === establishmentForSelectList.length
                          ? "All Selected"
                          : selected
                            .map(
                              (id) =>
                                establishmentForSelectList.find(
                                  (opt) => opt.id === id
                                )?.name
                            )
                            .join(", ")
                      }
                    >
                      <MenuItem onClick={handlePlaceOfWorkSelectAllToggle}>
                        <Checkbox checked={placeAllSelected} />
                        <ListItemText
                          primary={
                            placeAllSelected ? "Deselect All" : "Select All"
                          }
                        />
                      </MenuItem>
                      {[...establishmentForSelectList]
                        .sort((a, b) => {
                          const aSel = props.values.place_of_work.includes(a.id);
                          const bSel = props.values.place_of_work.includes(b.id);
                          return aSel === bSel ? 0 : aSel ? -1 : 1;
                        })
                        .map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={props.values.place_of_work.includes(option.id)} />
                            <ListItemText primary={option.name} />
                          </MenuItem>
                        ))}

                    </Field>
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
}

const mapStateToProps = (state) => ({
  languagesList: state.common.languagesList,
  servicesList: state.common.servicesList,
  professionTypesList: state.common.professionTypesList,
  specialitiesList: state.common.specialitiesList,
  professionDetail: state.profession.professionDetail,
  establishmentForSelectList: state.establishment.establishmentForSelectList,
  nationalitiesListForSelect: state.common.nationalitiesListForSelect,
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
    professionsDetailSuccess: (data) =>
      dispatch(professionsDetailSuccess(data)),
    professionsDetailFailed: () => dispatch(professionsDetailFailed()),
    nationalitiesListForSelectSuccess: (data) =>
      dispatch(nationalitiesListForSelectSuccess(data)),
    nationalitiesListForSelectFailed: () =>
      dispatch(nationalitiesListForSelectFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfession);