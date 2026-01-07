import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nationalityList: [],
  nationalityDetail: null,
};
const nationalitySlice = createSlice({
  name: "nationality",
  initialState: initialState,
  reducers: {
    nationalityListSuccess: (state, action) => {
      state.nationalityList = action.payload;
    },
    nationalityListFailed: (state, action) => {
      state.nationalityList = [];
    },
    nationalityDetailSuccess: (state, action) => {
      state.nationalityDetail = action.payload;
    },
    nationalityDetailFailed: (state, action) => {
      state.nationalityDetail = [];
    },
  },
});

export const {
  nationalityListSuccess,
  nationalityListFailed,
  nationalityDetailSuccess,
  nationalityDetailFailed,
} = nationalitySlice.actions;
export default nationalitySlice.reducer;
