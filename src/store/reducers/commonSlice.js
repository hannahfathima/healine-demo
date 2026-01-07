import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  languagesList: [],
  servicesList: [],
  professionTypesList: [],
  specialitiesList: [],
  facilitiesList: [],
  zonesList: [],
  citiesList: [],
  establishmentTypesList: [],
  establishmentSubTypesList: [],
  nationalitiesListForSelect: [],
  establishmentsList: [], // ADD THIS LINE
  professionsListByEstablishment: [], // ADD THIS LINE

};
const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    languagesListSuccess: (state, action) => {
      state.languagesList = action.payload;
    },
    languagesListFailed: (state, action) => {
      state.languagesList = [];
    },
    servicesListSuccess: (state, action) => {
      state.servicesList = action.payload;
    },
    servicesListFailed: (state, action) => {
      state.servicesList = [];
    },
    professionTypesListSuccess: (state, action) => {
      state.professionTypesList = action.payload;
    },
    professionTypesListFailed: (state, action) => {
      state.professionTypesList = [];
    },
    specialitiesListSuccess: (state, action) => {
      state.specialitiesList = action.payload;
    },
    specialitiesListFailed: (state, action) => {
      state.specialitiesList = [];
    },
    facilitiesListSuccess: (state, action) => {
      state.facilitiesList = action.payload;
    },
    facilitiesListFailed: (state, action) => {
      state.facilitiesList = [];
    },
    zonesListSuccess: (state, action) => {
      state.zonesList = action.payload;
    },
    zonesListFailed: (state, action) => {
      state.zonesList = [];
    },
    citiesListSuccess: (state, action) => {
      state.citiesList = action.payload;
    },
    citiesListFailed: (state, action) => {
      state.citiesList = [];
    },
    establishmentTypesListSuccess: (state, action) => {
      state.establishmentTypesList = action.payload;
    },
    establishmentTypesListFailed: (state, action) => {
      state.establishmentTypesList = [];
    },
    establishmentSubTypesListSuccess: (state, action) => {
      state.establishmentSubTypesList = action.payload;
    },
    establishmentSubTypesListFailed: (state, action) => {
      state.establishmentSubTypesList = [];
    },
    nationalitiesListForSelectSuccess: (state, action) => {
      state.nationalitiesListForSelect = action.payload;
    },
    nationalitiesListForSelectFailed: (state, action) => {
      state.nationalitiesListForSelect = [];
    },
    establishmentsListSuccess: (state, action) => {
      state.establishmentsList = action.payload;
    },
    establishmentsListFailed: (state, action) => {
      state.establishmentsList = [];
    },
    professionsListByEstablishmentSuccess: (state, action) => {
      state.professionsListByEstablishment = action.payload;
    },
    professionsListByEstablishmentFailed: (state, action) => {
      state.professionsListByEstablishment = [];
    },
  },
});

export const {
  languagesListSuccess,
  languagesListFailed,
  servicesListSuccess,
  servicesListFailed,
  professionTypesListSuccess,
  professionTypesListFailed,
  specialitiesListSuccess,
  specialitiesListFailed,
  facilitiesListSuccess,
  facilitiesListFailed,
  zonesListSuccess,
  zonesListFailed,
  citiesListSuccess,
  citiesListFailed,
  establishmentTypesListSuccess,
  establishmentTypesListFailed,
  establishmentSubTypesListSuccess,
  establishmentSubTypesListFailed,
  nationalitiesListForSelectSuccess,
  nationalitiesListForSelectFailed,
  establishmentsListSuccess, // ADD THIS
  establishmentsListFailed, // ADD THIS
  professionsListByEstablishmentSuccess, // ADD THIS
  professionsListByEstablishmentFailed, // ADD THIS

} = commonSlice.actions;
export default commonSlice.reducer;
