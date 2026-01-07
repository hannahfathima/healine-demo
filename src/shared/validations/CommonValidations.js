// import * as Yup from "yup";

// export const AddProfessionValidator = Yup.object().shape({
//   licence_no: Yup.string().optional(),
//   first_name: Yup.string().required("First name is required"),
//   last_name: Yup.string().required("Last name is required"),
//   // specialist: Yup.string().required("Specialist is required"),
//   designation: Yup.string().optional(),
//   // recommended: Yup.boolean(),
//   //   photo: Yup.string().optional(),
//   email: Yup.string().email("invalid email").optional(),
//   phone: Yup.string().optional(),
//   educational_qualification: Yup.string().optional(),
//   // working_since_month: Yup.number().required("Working since month is required"),
//   // working_since_year: Yup.string().required("Years of experience is required"),
//   working_since_year: Yup.string().optional(""),
//   profession_type_id: Yup.number().required("Profession type is required"),
//   nationality_id: Yup.number().optional(),
//   specialities: Yup.array().optional(),
//   services: Yup.array().optional(),
//   languages: Yup.array().min(1, "Select atleast one language"),
//   consultation_fees: Yup.number()
//     .typeError("Consultation fees must be a number")
//     .min(0, "Fees must be at least 0")
//     .required("Consultation fees are required"),

//   latitude: Yup.number()
//     .typeError("Latitude must be a number")
//     .required("Latitude is required"),

//   longitude: Yup.number()
//     .typeError("Longitude must be a number")
//     .required("Longitude is required"),

//   gender: Yup.string().oneOf(["male", "female", "other"], "Invalid gender").required("Gender is required"),

//   personal_visit_only: Yup.boolean(),
//   available: Yup.boolean(),



//   // working_hours: Yup.array()
//   //   .of(
//   //     Yup.object().shape({
//   //       day_of_week: Yup.string().required(),
//   //       sessions: Yup.array()
//   //         .of(
//   //           Yup.object().shape({
//   //             start_time: Yup.string().required("Start time is required"),
//   //             end_time: Yup.string().required("End time is required"),
//   //           })
//   //         )
//   //         .min(1, "At least one session is required"),
//   //     })
//   //   )
//   //   .required("Working hours are required"),
// });

// export const AddEstablishmentValidator = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string().email("Invalid email").optional(),
//   contact_number: Yup.string()
//     .required("Contact number is required"),
//     // .matches(/^\d{10}$/, "Contact number must be 10 digits"),
//   licence_no: Yup.string().optional(),
//   establishment_type: Yup.string().required("Establishment type is required"),
//   establishment_sub_type: Yup.string().optional(),
//   address: Yup.string().required("Address is required"),
//   zone_id: Yup.string().required("Zone is required"),
//   city_id: Yup.string().required("City is required"),
//   pin_code: Yup.string()
//     .optional()
//     .matches(/^\d{6}$/, "Pin code must be 6 digits"),
//   latitude: Yup.string().optional(),
//   longitude: Yup.string().optional(),
//   about: Yup.string().optional(),
//   is_24_by_7_working: Yup.number().required("24/7 working status is required"),
//   healineVerified: Yup.boolean().required("Headline verification status is required"),
//   facilities: Yup.array().optional(),
//   services: Yup.array().optional(),
//   specialities: Yup.array().optional(),
// });
// export const EditEstablishmentValidator = Yup.object().shape({
//   name: Yup.string().required("First name is required"),
//   email: Yup.string().email("invalid email").optional(),
//   contact_number: Yup.number().required("Contact number is required"),
//   licence_no: Yup.string().optional(),
//   establishment_type: Yup.number().required("Establishment type is required"),
//   establishment_sub_type: Yup.number().optional(""),
//   primary_photo: Yup.mixed().optional(),
//   address: Yup.string().required("Address is required"),
//   zone_id: Yup.number().required("Zone is required"),
//   city_id: Yup.number().required("City is required"),
//   // pin_code: Yup.number().required("Pin code is required"),
//   facilities: Yup.array().optional(),
//   is_24_by_7_working: Yup.number().required(),
// });
// export const AddSpecialityValidator = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   icon: Yup.mixed().required("Icon is required"),
//   description: Yup.string().optional(),
//   tier: Yup.number().required("Tier is required"),
// });

// export const AddEstablishmentHoursValidator = Yup.object().shape({
//   establishment_id: Yup.number().required("Establishment id is required"),
//   day_of_week: Yup.number().required("Day of week cannot be blank"),
//   start_time: Yup.string().required("Start time cannot be blank."),
//   end_time: Yup.string().required("End time cannot be blank"),
//   // is_day_off: Yup.number().optional(),
//   // start_time: Yup.string().required("Start time cannot be blank."),
//   // start_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
//   // end_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
// });
// export const EditEstablishmentHoursValidator = Yup.object().shape({
//   day_of_week: Yup.number().required("Day of week cannot be blank"),
//   start_time: Yup.string().required("Start time cannot be blank."),
//   end_time: Yup.string().required("End time cannot be blank"),
//   // is_day_off: Yup.number().optional(),
//   // start_time: Yup.string().required("Start time cannot be blank."),
//   // start_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
//   // end_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
// });

// export const AddDepartmentHoursValidator = Yup.object().shape({
//   department_id: Yup.number().required("Department id is required"),
//   day_of_week: Yup.number().required("Day of week cannot be blank"),
//   // is_day_off: Yup.number().optional(),
//   start_time: Yup.string().required("Start time cannot be blank."),
//   end_time: Yup.string().required("End time cannot be blank"),
//   // start_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
//   // end_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
// });
// export const AddDepartmentHolidayValidator = Yup.object().shape({
//   department_id: Yup.number().required("Department id is required"),
//   date: Yup.date().required("Date cannot be blank"),
//   occasion: Yup.string().optional(),
// });
// export const AddEstablishmentHolidayValidator = Yup.object().shape({
//   establishment_id: Yup.number().required("Department id is required"),
//   date: Yup.date().required("Date cannot be blank"),
//   occasion: Yup.string().optional(),
// });

// export const EditDepartmentHoursValidator = Yup.object().shape({
//   day_of_week: Yup.number().required("Day of week cannot be blank"),
//   start_time: Yup.string().required("Start time cannot be blank."),
//   end_time: Yup.string().required("End time cannot be blank"),
//   // is_day_off: Yup.number().optional(),
//   // start_time: Yup.string().required("Start time cannot be blank."),
//   // start_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
//   // end_time: Yup.string().when("is_day_off", {
//   //   is: (is_day_off) => is_day_off == 0,
//   //   then: Yup.string().required("Start time cannot be blank."),
//   //   otherwise: Yup.string(),
//   // }),
// });

// export const AddDepartmentValidator = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   establishment_id: Yup.number().required("Establishment is required"),
//   speciatlities: Yup.array().optional(),
//   professions: Yup.array().optional(),
// });

// // export const AddDepartmentHoursValidator = Yup.object().shape({
// //   department_id: Yup.number().required("Department is required"),
// //   hours_data: Yup.array(
// //     Yup.object({
// //       day_of_week: Yup.number().required("Day of week cannot be blank"),
// //       start_time: Yup.string().required("Start time cannot be blank."),
// //       end_time: Yup.string().required("End time cannot be blank"),
// //       // is_day_off: Yup.number().optional(),
// //     })
// //   ),
// // });
// // export const AddEstablishmentHoursValidator = Yup.object().shape({
// //   establishment_id: Yup.number().required("Department is required"),
// //   hours_data: Yup.array(
// //     Yup.object({
// //       day_of_week: Yup.number().required("Day of week cannot be blank"),
// //       start_time: Yup.string().required("Start time cannot be blank."),
// //       end_time: Yup.string().required("End time cannot be blank"),
// //       // is_day_off: Yup.number().optional(),
// //     })
// //   ),
// // });
// // export const AddSpecialityValidator = Yup.object().shape({
// //   name: Yup.string().required("Name is required"),
// //   icon: Yup.mixed().required("Icon is required"),
// //   description: Yup.string().optional(),
// //   tier: Yup.number().required("Please select is required"),
// // });
// export const EditSpecialityValidator = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   // icon: Yup.mixed().required("Icon is required"),
//   description: Yup.string().optional(),
//   tier: Yup.number().required("Tier is required"),
// });
import * as Yup from "yup";

export const AddProfessionValidator = Yup.object().shape({
  licence_no: Yup.string().nullable(),
  first_name: Yup.string().nullable(),
  last_name: Yup.string().nullable(),
  designation: Yup.string().nullable(),
  email: Yup.string().email("Invalid email").nullable(),
  phone: Yup.string()
    .matches(/^[0-9]*$/, "Phone number must contain only digits")
    .nullable(),
  educational_qualification: Yup.string().nullable(),
  expert_in: Yup.string().nullable(),
  working_since_year: Yup.string().nullable(),
  profession_type_id: Yup.number().nullable(),
  nationality_id: Yup.number().nullable(),
  specialities: Yup.array().nullable(),
  services: Yup.array().nullable(),
  languages: Yup.array().nullable(),
  consultation_fees: Yup.number()
    .typeError("Consultation fees must be a number")
    .min(0, "Fees must be at least 0")
    .nullable(),
  latitude: Yup.number()
    .typeError("Latitude must be a number")
    .nullable(),
  longitude: Yup.number()
    .typeError("Longitude must be a number")
    .nullable(),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Invalid gender")
    .nullable(),
  online_consultation: Yup.boolean().nullable(),
  available: Yup.boolean().nullable(),
  healineVerified: Yup.boolean().nullable(),
  recommended: Yup.boolean().nullable(),
  topRated: Yup.boolean().nullable(),
  topRatedTitle: Yup.string().when("topRated", {
    is: true,
    then: Yup.string()
      .required("Top Rated Title is required when Top Rated is selected")
      .max(255, "Top Rated Title must be at most 255 characters"),
    otherwise: Yup.string().nullable(),
  }),
  working_hours: Yup.array()
    .of(
      Yup.object().shape({
        day_of_week: Yup.string().nullable(),
        sessions: Yup.array()
          .of(
            Yup.object().shape({
              start_time: Yup.string().nullable(),
              end_time: Yup.string().nullable(),
            })
          )
          .nullable(),
        is_leave: Yup.boolean().nullable(),
      })
    )
    .nullable(),
});

export const AddEstablishmentValidator = Yup.object().shape({
  name: Yup.string().nullable(),
  email: Yup.string().email("Invalid email").nullable(),
  // contact_number: Yup.string()
  //   .matches(/^[0-9]*$/, "Contact number must contain only digits")
  //   .nullable(),

  licence_no: Yup.string().nullable(),
  establishment_type: Yup.string().nullable(),
  establishment_sub_type: Yup.string().nullable(),
  address: Yup.string().nullable(),
  zone_id: Yup.string().nullable(),
  city_id: Yup.string().nullable(),
  pin_code: Yup.string()
    .matches(/^\d{6}$/, "Pin code must be 6 digits")
    .nullable(),
  latitude: Yup.string().nullable(),
  longitude: Yup.string().nullable(),
  about: Yup.string().nullable(),
  is_24_by_7_working: Yup.number().nullable(),
  healineVerified: Yup.boolean().nullable(),
  facilities: Yup.array().nullable(),
  services: Yup.array().nullable(),
  topRated: Yup.boolean().nullable(),
  topRatedTitle: Yup.string().when("topRated", {
    is: true,
    then: Yup.string()
      .required("Top Rated Title is required when Top Rated is selected")
      .max(255, "Top Rated Title must be at most 255 characters"),
    otherwise: Yup.string().nullable(),
  }),
  specialities: Yup.array().nullable(),
});

export const EditEstablishmentValidator = Yup.object().shape({
  name: Yup.string().nullable(),
  email: Yup.string().email("Invalid email").nullable(),
  // contact_number: Yup.string()
  //   .matches(/^[0-9]*$/, "Contact number must contain only digits")
  //   .nullable(),
  licence_no: Yup.string().nullable(),
  establishment_type: Yup.number().nullable(),
  establishment_sub_type: Yup.number().nullable(),
  primary_photo: Yup.mixed().nullable(),
  address: Yup.string().nullable(),
  zone_id: Yup.number().nullable(),
  city_id: Yup.number().nullable(),
  topRated: Yup.boolean().nullable(),
  topRatedTitle: Yup.string().when("topRated", {
    is: true,
    then: Yup.string()
      .required("Top Rated Title is required when Top Rated is selected")
      .max(255, "Top Rated Title must be at most 255 characters"),
    otherwise: Yup.string().nullable(),
  }),
  pin_code: Yup.number()
    .typeError("Pin code must be a number")
    .nullable(),
  facilities: Yup.array().nullable(),
  is_24_by_7_working: Yup.number().nullable(),
});

export const AddSpecialityValidator = Yup.object().shape({
  name: Yup.string().nullable(),
  icon: Yup.mixed().nullable(),
  description: Yup.string().nullable(),
  tier: Yup.number().nullable(),
});

export const EditSpecialityValidator = Yup.object().shape({
  name: Yup.string().nullable(),
  description: Yup.string().nullable(),
  tier: Yup.number().nullable(),
});

export const AddEstablishmentHoursValidator = Yup.object().shape({
  establishment_id: Yup.number().nullable(),
  day_of_week: Yup.number().nullable(),
  start_time: Yup.string().nullable(),
  end_time: Yup.string().nullable(),
  is_day_off: Yup.number().nullable(),
});

export const EditEstablishmentHoursValidator = Yup.object().shape({
  day_of_week: Yup.number().nullable(),
  start_time: Yup.string().nullable(),
  end_time: Yup.string().nullable(),
  is_day_off: Yup.number().nullable(),
});

export const AddDepartmentHoursValidator = Yup.object().shape({
  department_id: Yup.number().nullable(),
  day_of_week: Yup.number().nullable(),
  start_time: Yup.string().nullable(),
  end_time: Yup.string().nullable(),
});

export const EditDepartmentHoursValidator = Yup.object().shape({
  day_of_week: Yup.number().nullable(),
  start_time: Yup.string().nullable(),
  end_time: Yup.string().nullable(),
});

export const AddDepartmentHolidayValidator = Yup.object().shape({
  department_id: Yup.number().nullable(),
  date: Yup.date().nullable(),
  occasion: Yup.string().nullable(),
});

export const AddEstablishmentHolidayValidator = Yup.object().shape({
  establishment_id: Yup.number().nullable(),
  date: Yup.date().nullable(),
  occasion: Yup.string().nullable(),
});

export const AddDepartmentValidator = Yup.object().shape({
  name: Yup.string().nullable(),
  establishment_id: Yup.number().nullable(),
  specialities: Yup.array().nullable(),
  professions: Yup.array().nullable(),
});