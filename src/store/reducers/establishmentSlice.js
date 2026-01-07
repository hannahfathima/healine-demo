import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  establishmentList: [],
  establishmentForSelectList: [],
  establishmentDetail: null,
  estWorkingHoursList: [],
  estWorkingHoursDetail: null,
  establishmentHolidayList: [],
  establishmentHolidayDetail: null,
};
const establishmentSlice = createSlice({
  name: "establishment",
  initialState: initialState,
  reducers: {
    establishmentListSuccess: (state, action) => {
      state.establishmentList = action.payload;
    },
    establishmentListFailed: (state, action) => {
      state.establishmentList = [];
    },
    estWorkingHoursListSuccess: (state, action) => {
      state.estWorkingHoursList = action.payload;
    },
    estWorkingHoursListFailed: (state, action) => {
      state.estWorkingHoursList = [];
    },
    establishmentSelectListSuccess: (state, action) => {
      state.establishmentForSelectList = action.payload;
    },
    establishmentSelectListFailed: (state, action) => {
      state.establishmentForSelectList = [];
    },
    establishmentDetailSuccess: (state, action) => {
      state.establishmentDetail = action.payload;
    },
    establishmentDetailFailed: (state, action) => {
      state.establishmentDetail = [];
    },
    estWorkingHoursDetailSuccess: (state, action) => {
      state.estWorkingHoursDetail = action.payload;
    },
    estWorkingHoursDetailFailed: (state, action) => {
      state.estWorkingHoursDetail = [];
    },
    establishmentHolidayListSuccess: (state, action) => {
      state.establishmentHolidayList = action.payload;
    },
    establishmentHolidayListFailed: (state, action) => {
      state.establishmentHolidayList = [];
    },
    establishmentHolidayDetailSuccess: (state, action) => {
      state.establishmentHolidayDetail = action.payload;
    },
    establishmentHolidayDetailFailed: (state, action) => {
      state.establishmentHolidayDetail = null;
    },
  },
});

export const {
  establishmentListSuccess,
  establishmentListFailed,
  establishmentDetailSuccess,
  establishmentDetailFailed,
  establishmentSelectListSuccess,
  establishmentSelectListFailed,
  estWorkingHoursList,
  estWorkingHoursListSuccess,
  estWorkingHoursListFailed,
  estWorkingHoursDetailSuccess,
  estWorkingHoursDetailFailed,
  establishmentHolidayListSuccess,
  establishmentHolidayListFailed,
  establishmentHolidayDetailSuccess,
  establishmentHolidayDetailFailed,
} = establishmentSlice.actions;
export default establishmentSlice.reducer;
