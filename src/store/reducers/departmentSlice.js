import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departmentsList: [],
  departmentDetail: null,
  deptWorkingHrsList: [],
  deptWorkingHrsDetail: null,
  departmentHolidayList: [],
  departmentHolidayDetail: null,
};
const departmentSlice = createSlice({
  name: "department",
  initialState: initialState,
  reducers: {
    departmentsListSuccess: (state, action) => {
      state.departmentsList = action.payload;
    },
    departmentsListFailed: (state, action) => {
      state.departmentsList = [];
    },
    deptWorkingHrsListSuccess: (state, action) => {
      state.deptWorkingHrsList = action.payload;
    },
    deptWorkingHrsListFailed: (state, action) => {
      state.deptWorkingHrsList = [];
    },
    departmentDetailSuccess: (state, action) => {
      state.departmentDetail = action.payload;
    },
    departmentDetailFailed: (state, action) => {
      state.departmentDetail = [];
    },
    deptWorkingHrsDetailSuccess: (state, action) => {
      state.deptWorkingHrsDetail = action.payload;
    },
    deptWorkingHrsDetailFailed: (state, action) => {
      state.deptWorkingHrsDetail = [];
    },
    departmentHolidayListSuccess: (state, action) => {
      state.departmentHolidayList = action.payload;
    },
    departmentHolidayListFailed: (state, action) => {
      state.departmentHolidayList = [];
    },
    departmentHolidayDetailSuccess: (state, action) => {
      state.departmentHolidayDetail = action.payload;
    },
    departmentHolidayDetailFailed: (state, action) => {
      state.departmentHolidayDetail = null;
    },
  },
});

export const {
  departmentsListSuccess,
  departmentsListFailed,
  departmentDetailSuccess,
  departmentDetailFailed,
  deptWorkingHrsDetailSuccess,
  deptWorkingHrsDetailFailed,
  deptWorkingHrsListSuccess,
  deptWorkingHrsListFailed,
  departmentHolidayListSuccess,
  departmentHolidayListFailed,
  departmentHolidayDetailSuccess,
  departmentHolidayDetailFailed,
} = departmentSlice.actions;
export default departmentSlice.reducer;
