import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  specialitiesList: [],
  specialitiesDetail: null,
};
const specialitySlice = createSlice({
  name: "speciality",
  initialState: initialState,
  reducers: {
    specialitiesListSuccess: (state, action) => {
      state.specialitiesList = action.payload;
    },
    specialitiesListFailed: (state, action) => {
      state.specialitiesList = [];
    },
    specialitiesDetailSuccess: (state, action) => {
      state.specialitiesDetail = action.payload;
    },
    specialitiesDetailFailed: (state, action) => {
      state.specialitiesDetail = [];
    },
  },
});

export const {
  specialitiesListSuccess,
  specialitiesListFailed,
  specialitiesDetailSuccess,
  specialitiesDetailFailed,
} = specialitySlice.actions;
export default specialitySlice.reducer;
