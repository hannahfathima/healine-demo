import {
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  ListItemText,
  FormControl,
} from "@mui/material";
import imageCompression from 'browser-image-compression';
import { ErrorMessage, Field, Formik } from "formik";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { createRecord, fetchList } from "../../apis/services/CommonApiService";
import FormikInput from "../../components/Formik/FormikInput";
import FormikSelect from "../../components/Formik/FormikSelect";
import ShowInputError from "../../components/ShowInputError";
import { Routing } from "../../shared/constants/routing";
import { AddEstablishmentValidator } from "../../shared/validations/CommonValidations";
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Autocomplete from "react-google-autocomplete";
import {
  citiesListFailed,
  citiesListSuccess,
  establishmentTypesListFailed,
  establishmentTypesListSuccess,
  establishmentSubTypesListFailed,
  establishmentSubTypesListSuccess,
  facilitiesListFailed,
  facilitiesListSuccess,
  specialitiesListFailed,
  specialitiesListSuccess,
  zonesListFailed,
  zonesListSuccess,
  servicesListFailed,
  servicesListSuccess,
} from "../../store/reducers/commonSlice";
import {
  cityList,
  establishment24By7Options,
  establishmentTypes,
  languagesData,
  servicesData,
  specialitiesData,
  zonesData,
} from "../../utils/jsonData";
import FormikAutocomplete from "../../components/Formik/FormikAutocomplete";

function AddEstablishment(props) {
  const {
    establishmentTypesList,
    establishmentSubTypesList,
    facilitiesList,
    zonesList,
    citiesList,
    specialitiesList,
    establishmentTypesListSuccess,
    establishmentTypesListFailed,
    establishmentSubTypesListSuccess,
    establishmentSubTypesListFailed,
    zonesListSuccess,
    zonesListFailed,
    citiesListSuccess,
    citiesListFailed,
    specialitiesListSuccess,
    specialitiesListFailed,
    facilitiesListSuccess,
    facilitiesListFailed,
    servicesList,
    servicesListSuccess,
    servicesListFailed,
  } = props;
  const navigate = useNavigate();
  const initialState = {
    name: "",
    email: "",
    mobile_country_code: "", // New field for country code
    contact_number: "",
    licence_no: "",
    establishment_type: "",
    establishment_sub_type: "",
    primary_photo: null,
    address: "",
    zone_id: "",
    city_id: "",
    pin_code: "",
    // establishment_images: [], // Array of objects: { file: File, image_type: 'gallery' or 'main' }
    // banner_images: [], // Array of objects: { file: File, linkUrl: '', type: 'banner' }
    specialities: [],
    facilities: [],
    latitude: "",
    longitude: "",
    recommended: false,
    services: [],
    is_24_by_7_working: false, // MUST be boolean
    healineVerified: false,
    about: "",
    topRated: false, // Add topRated
    topRatedTitle: "", // Add topRatedTitle
    expertin: "" // Add this line
  };

  // Update handleSubmit to include primary_photo
  // const handleSubmit = async (values, { setSubmitting }) => {
  //   console.log("handleSubmit called with values:", values);

  //   let formData = new FormData();
  //   formData.append("name", values.name || "");
  //   formData.append("email", values.email || "");
  //   formData.append("contact_number", values.contact_number || "");
  //   formData.append("licence_no", values.licence_no || "");
  //   formData.append("establishment_type", values.establishment_type || "");
  //   formData.append("establishment_sub_type", values.establishment_sub_type || "");
  //   formData.append("address", values.address || "");
  //   formData.append("zone_id", values.zone_id || "");
  //   formData.append("city_id", values.city_id || "");
  //   formData.append("pin_code", values.pin_code || "");
  //   formData.append("is_24_by_7_working", values.is_24_by_7_working ? 1 : 0);
  //   formData.append("healineVerified", values.healineVerified ? true : false);
  //   formData.append("about", values.about || "");
  //   formData.append("latitude", values.latitude || "");
  //   formData.append("longitude", values.longitude || "");
  //   formData.append("recommended", values.recommended ? true : false);
  //   formData.append("topRated", values.topRated ? true : false);
  //   formData.append("topRatedTitle", values.topRatedTitle || "");
  //   if (values.primary_photo) {
  //     formData.append("primary_photo", values.primary_photo); // Append primary photo if exists
  //   }

  //   // Handle specialities, facilities, and services
  //   values.specialities.forEach((element, key) => {
  //     formData.append(`specialities[${key}]`, element);
  //   });
  //   values.facilities.forEach((element, key) => {
  //     formData.append(`facilities[${key}]`, element);
  //   });
  //   values.services.forEach((element, key) => {
  //     formData.append(`services[${key}]`, element);
  //   });

  //   console.log("FormData entries:");
  //   for (let [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value instanceof File ? value.name : value}`);
  //   }

  //   try {
  //     const result = await createRecord(
  //       formData,
  //       ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE
  //     );
  //     console.log("API response:", result);
  //     if (result.status === 200) {
  //       toast.success(result.message || "Establishment created successfully");
  //       navigate(Routing.Establishment);
  //     } else {
  //       console.error("API error response:", result);
  //       toast.error(result.message || "Failed to create establishment");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     toast.error(error.message || "An error occurred while submitting the form");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form values:", values);
    let formData = new FormData();

    if (values.name) formData.append("name", values.name);
    if (values.email) formData.append("email", values.email);
    if (values.mobile_country_code) formData.append("mobile_country_code", values.mobile_country_code);
    if (values.contact_number) formData.append("contact_number", values.contact_number);
    if (values.licence_no) formData.append("licence_no", values.licence_no);
    if (values.establishment_type) formData.append("establishment_type", values.establishment_type);
    if (values.establishment_sub_type) formData.append("establishment_sub_type", values.establishment_sub_type);
    if (values.address) formData.append("address", values.address);
    if (values.zone_id) formData.append("zone_id", values.zone_id);
    if (values.city_id) formData.append("city_id", values.city_id);
    if (values.pin_code) formData.append("pin_code", values.pin_code);
    if (values.latitude) formData.append("latitude", values.latitude);
    if (values.longitude) formData.append("longitude", values.longitude);
    if (values.about) formData.append("about", values.about);
    formData.append("is_24_by_7_working", Boolean(values.is_24_by_7_working));
    formData.append("healineVerified", values.healineVerified ? "true" : "false");
    formData.append("recommended", values.recommended ? "true" : "false");
    formData.append("topRated", values.topRated ? "true" : "false");
    if (values.expertin) formData.append("expertin", values.expertin);
    if (values.topRated && values.topRatedTitle) formData.append("topRatedTitle", values.topRatedTitle);
    if (values.primary_photo) formData.append("primary_photo", values.primary_photo);

    if (values.specialities?.length) {
      values.specialities.forEach((element, key) => {
        if (element) formData.append(`specialities[${key}]`, element);
      });
    }
    if (values.facilities?.length) {
      values.facilities.forEach((element, key) => {
        if (element) formData.append(`facilities[${key}]`, element);
      });
    }
    if (values.services?.length) {
      values.services.forEach((element, key) => {
        if (element) formData.append(`services[${key}]`, element);
      });
    }

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const result = await createRecord(
        formData,
        ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE
      );
      console.log("API response:", result);
      if (result.status === 200) {
        toast.success(result.message || "Establishment created successfully");
        toast.info("Status is set to inactive by default. You can enable it from the list.");

        navigate(Routing.Establishment);
      } else {
        toast.error(
          result?.data?.message ||
          Object.values(result?.data?.data || {}).join(", ") ||
          result.message ||
          "Failed to create establishment"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
        Object.values(error.response?.data?.data || {}).join(", ") ||
        error.message ||
        "An error occurred while submitting the form"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEstablishmentTypeChange = (estId) => {
    getEstablishmentSubTypesList(estId);
  };
  const handleZoneChangeChange = (zoneId) => {
    getCitiesList(zoneId);
  };

  const getCitiesList = useCallback(async (zone_id) => {
    const result = await fetchList(
      ApiEndPoints.GET_CITIES_FOR_SELECT + "?zone_id=" + zone_id
    );
    if (result.status === 200) {
      citiesListSuccess(result.data);
    } else {
      citiesListFailed();
    }
  }, []);

  const getEstablishmentTypesList = useCallback(async () => {
    const result = await fetchList(
      ApiEndPoints.GET_ESTABLISHMENT_TYPES_FOR_SELECT
    );
    if (result.status === 200) {
      establishmentTypesListSuccess(result.data);
    } else {
      establishmentTypesListFailed();
    }
  }, []);
  const getEstablishmentSubTypesList = useCallback(async (establishmentId) => {
    const result = await fetchList(
      ApiEndPoints.GET_ESTABLISHMENT_SUB_TYPES_FOR_SELECT +
      "?establishment_id=" +
      establishmentId
    );
    if (result.status === 200) {
      establishmentSubTypesListSuccess(result.data);
    } else {
      establishmentSubTypesListFailed();
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
  const getFacilitiesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_FACILITIES_FOR_SELECT);
    if (result.status === 200) {
      facilitiesListSuccess(result.data);
    } else {
      facilitiesListFailed();
    }
  }, []);
  const getZonesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_ZONES_FOR_SELECT);
    if (result.status === 200) {
      zonesListSuccess(result.data);
    } else {
      zonesListFailed();
    }
  }, []);

  const onSearchFacilityChange = async (event) => {
    const { value } = event.target;
    if (value) {
      const result = await fetchList(
        ApiEndPoints.GET_FACILITIES_FOR_SELECT + `?search_text=${value}`
      );
      if (result.status === 200) {
        facilitiesListSuccess(result.data);
      } else {
        facilitiesListFailed();
      }
    } else {
      // specialitiesListFailed();
    }
  };
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

  const getServicesList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_SERVICES_FOR_SELECT);
    console.log("tiuhhaisua", result.data);

    if (result.status === 200) {
      servicesListSuccess(result.data);
    } else {
      servicesListFailed();
    }
  }, []);

  useEffect(() => {
    getEstablishmentTypesList();
    getEstablishmentSubTypesList(0);
    getSpecialitiesList();
    getZonesList();
    getCitiesList(0);
    getFacilitiesList();
    getServicesList();
  }, [
    getEstablishmentTypesList,
    getEstablishmentSubTypesList,
    getSpecialitiesList,
    getZonesList,
    getCitiesList,
    getFacilitiesList,
    getServicesList,
  ]);

  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">Add Establishment</h4>
      </div>
      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={true}
        enableReinitialize={true}
        validationSchema={AddEstablishmentValidator}
      >
        {(props) => {
          const { handleSubmit, isSubmitting } = props;
          const allSelected =
            props.values.specialities.length === specialitiesList.length;
          const handleSelectAllToggle = () => {
            props.setFieldValue(
              "specialities",
              allSelected ? [] : specialitiesList.map((opt) => opt.id)
            );
          };

          const facAllSelected =
            props.values.facilities.length === facilitiesList.length;
          const handleFacilitiesSelectAllToggle = () => {
            props.setFieldValue(
              "facilities",
              facAllSelected ? [] : facilitiesList.map((opt) => opt.id)
            );
          };

          const serAllSelected =
            props.values.services.length === servicesList.length;
          const handleServicesSelectAllToggle = () => {
            props.setFieldValue(
              "services",
              serAllSelected ? [] : servicesList.map((opt) => opt.id)
            );
          };

          return (
            <>
              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item lg={4}>
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
                      Contact Number <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="US"
                      value={
                        props.values.mobile_country_code &&
                          props.values.contact_number
                          ? `${props.values.mobile_country_code}${props.values.contact_number}`
                          : ""
                      }
                      onChange={(value) => {
                        if (value) {
                          try {
                            const phoneNumber = parsePhoneNumber(value);
                            if (phoneNumber) {
                              const countryCode = `+${phoneNumber.countryCallingCode}`;
                              const nationalNumber = phoneNumber.nationalNumber;

                              console.log("Country Code:", countryCode);
                              console.log("Contact Number:", nationalNumber);

                              props.setFieldValue(
                                "mobile_country_code",
                                countryCode
                              );
                              props.setFieldValue(
                                "contact_number",
                                nationalNumber
                              );
                            }
                          } catch (error) {
                            console.error("Error parsing phone number:", error);
                            props.setFieldValue("mobile_country_code", "");
                            props.setFieldValue("contact_number", value);
                          }
                        } else {
                          props.setFieldValue("mobile_country_code", "");
                          props.setFieldValue("contact_number", "");
                        }
                      }}
                      placeholder="Enter contact number"
                      style={{
                        border: "1px solid #696969ff",
                        borderRadius: "4px",
                        padding: "0px 8px",
                        width: "100%",
                      }}
                    />
                    <ErrorMessage
                      name="mobile_country_code"
                      component={ShowInputError}
                    />
                    <ErrorMessage
                      name="contact_number"
                      component={ShowInputError}
                    />
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
                      Select Establishment Type{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select type"
                      name="establishment_type"
                      options={establishmentTypesList?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        props.setFieldValue("establishment_type", selectedValue);
                        props.setFieldValue("establishment_sub_type", "");
                        handleEstablishmentTypeChange(selectedValue);
                      }}
                      component={FormikSelect}
                    />
                    <ErrorMessage
                      name="establishment_type"
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
                      Select Establishment Sub Type
                    </Typography>
                    <Field
                      label="Select sub type"
                      name="establishment_sub_type"
                      options={establishmentSubTypesList?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    />
                    <ErrorMessage
                      name="establishment_sub_type"
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
                      Primary Photo
                    </Typography>
                    <Field
                      name="primary_photo"
                      type="file"
                      fullWidth
                      inputProps={{ accept: 'image/*' }}
                      onChange={async (event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          try {
                            console.log('Original file size:', file.size / 1024 / 1024, 'MB');

                            const options = {
                              maxSizeMB: 1,           // Max size after compression
                              maxWidthOrHeight: 1920, // Max dimension
                              useWebWorker: true,     // Improves performance
                              initialQuality: 0.85    // Start with 85% quality (adjustable)
                            };

                            const compressedFile = await imageCompression(file, options);
                            console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');

                            // Convert back to File object if needed (name, type preserved)
                            const finalFile = new File([compressedFile], file.name, {
                              type: file.type,
                              lastModified: Date.now(),
                            });

                            props.setFieldValue("primary_photo", finalFile);
                          } catch (error) {
                            console.error("Image compression error:", error);
                            // Fallback: use original file
                            props.setFieldValue("primary_photo", file);
                          }
                        }
                      }}
                      component={TextField}
                    />
                    <ErrorMessage
                      name="primary_photo"
                      component={ShowInputError}
                    />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="Address"
                      required
                      name="address"
                      placeHolder="Address"
                      component={FormikInput}
                    />
                    <ErrorMessage name="address" component={ShowInputError} />
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
                      Select Zone <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select zone"
                      name="zone_id"
                      id="zone_id"
                      options={zonesList?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      onChange={(event) => {
                        const selectedValue = event.target.value;
                        props.setFieldValue("zone_id", selectedValue);
                        props.setFieldValue("city_id", "");
                        handleZoneChangeChange(selectedValue);
                      }}
                      component={FormikSelect}
                    />
                    <ErrorMessage name="zone_id" component={ShowInputError} />
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
                      Select City <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select city"
                      required
                      name="city_id"
                      id="city_id"
                      options={citiesList?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    />
                    <ErrorMessage name="city_id" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="Pin Code"
                      name="pin_code"
                      placeHolder="Pin Code"
                      maxLength={10}
                      component={FormikInput}
                    />
                    <ErrorMessage name="pin_code" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="Latitude"
                      name="latitude"
                      placeHolder="Latitude"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage name="latitude" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="Longitude"
                      name="longitude"
                      placeHolder="Longitude"
                      maxLength={150}
                      component={FormikInput}
                    />
                    <ErrorMessage name="longitude" component={ShowInputError} />
                  </Grid>
                  <Grid item lg={4}>
                    <Field
                      label="About"
                      name="about"
                      placeHolder="About the establishment"
                      multiline
                      rows={4}
                      component={FormikInput}
                    />
                    <ErrorMessage name="about" component={ShowInputError} />
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
                      as={Select}
                      multiple
                      fullWidth
                      className="SpecDropdownCheckbox1"
                      renderValue={(selected) =>
                        selected.length === specialitiesList.length
                          ? "All Selected"
                          : selected
                            .map((id) =>
                              specialitiesList.find((opt) => opt.id === id)
                                ?.name
                            )
                            .join(", ")
                      }
                    >
                      <MenuItem onClick={handleSelectAllToggle}>
                        <Checkbox checked={allSelected} />
                        <ListItemText
                          primary={allSelected ? "Deselect All" : "Select All"}
                        />
                      </MenuItem>
                      {specialitiesList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox
                            checked={props.values.specialities.includes(
                              option.id
                            )}
                          />
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
                    <Field
                      label="Expert In"
                      name="expertin"
                      placeHolder="Expert In"
                      maxLength={255}
                      component={FormikInput}
                    />
                    <ErrorMessage name="expertin" component={ShowInputError} />
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
                      Select Services
                    </Typography>
                    <Field
                      name="services"
                      as={Select}
                      multiple
                      fullWidth
                      className="SpecDropdownCheckbox1"
                      renderValue={(selected) =>
                        selected.length === servicesList.length
                          ? "All Selected"
                          : selected
                            .map((id) =>
                              servicesList.find((opt) => opt.id === id)?.name
                            )
                            .join(", ")
                      }
                    >
                      <MenuItem onClick={handleServicesSelectAllToggle}>
                        <Checkbox checked={serAllSelected} />
                        <ListItemText
                          primary={serAllSelected ? "Deselect All" : "Select All"}
                        />
                      </MenuItem>
                      {servicesList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox
                            checked={props.values.services.includes(option.id)}
                          />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name="services" component={ShowInputError} />
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
                      Select Facilities
                    </Typography>
                    <Field
                      name="facilities"
                      as={Select}
                      multiple
                      fullWidth
                      className="SpecDropdownCheckbox1"
                      renderValue={(selected) =>
                        selected.length === facilitiesList.length
                          ? "All Selected"
                          : selected
                            .map((id) =>
                              facilitiesList.find((opt) => opt.id === id)?.name
                            )
                            .join(", ")
                      }
                    >
                      <MenuItem onClick={handleFacilitiesSelectAllToggle}>
                        <Checkbox checked={facAllSelected} />
                        <ListItemText
                          primary={facAllSelected ? "Deselect All" : "Select All"}
                        />
                      </MenuItem>
                      {facilitiesList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox
                            checked={props.values.facilities.includes(option.id)}
                          />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name="facilities" component={ShowInputError} />
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
                      Is Establishment 24 x 7 working{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Field
                      label="Select Is Establishment 24 x 7 working"
                      name="is_24_by_7_working"
                      options={establishment24By7Options?.map((data) => ({
                        title: data.name,
                        value: data.id,
                      }))}
                      component={FormikSelect}
                    />
                    <ErrorMessage
                      name="is_24_by_7_working"
                      component={ShowInputError}
                    />
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
                    <ErrorMessage
                      name="topRatedTitle"
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
                      disabled={isSubmitting}
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
                      {isSubmitting ? "Saving..." : "Save"}
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
  establishmentTypesList: state.common.establishmentTypesList,
  establishmentSubTypesList: state.common.establishmentSubTypesList,
  zonesList: state.common.zonesList,
  citiesList: state.common.citiesList,
  facilitiesList: state.common.facilitiesList,
  specialitiesList: state.common.specialitiesList,
  servicesList: state.common.servicesList,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    establishmentTypesListSuccess: (data) =>
      dispatch(establishmentTypesListSuccess(data)),
    establishmentTypesListFailed: () =>
      dispatch(establishmentTypesListFailed()),
    establishmentSubTypesListSuccess: (data) =>
      dispatch(establishmentSubTypesListSuccess(data)),
    establishmentSubTypesListFailed: () =>
      dispatch(establishmentSubTypesListFailed()),
    zonesListSuccess: (data) => dispatch(zonesListSuccess(data)),
    zonesListFailed: () => dispatch(zonesListFailed()),
    citiesListSuccess: (data) => dispatch(citiesListSuccess(data)),
    citiesListFailed: () => dispatch(citiesListFailed()),
    specialitiesListSuccess: (data) => dispatch(specialitiesListSuccess(data)),
    specialitiesListFailed: () => dispatch(specialitiesListFailed()),
    facilitiesListSuccess: (data) => dispatch(facilitiesListSuccess(data)),
    facilitiesListFailed: () => dispatch(facilitiesListFailed()),
    servicesListSuccess: (data) => dispatch(servicesListSuccess(data)),
    servicesListFailed: () => dispatch(servicesListFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEstablishment);