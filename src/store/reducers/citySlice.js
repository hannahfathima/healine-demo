import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cityList: [],
  cityDetail: null,
};
const citySlice = createSlice({
  name: "city",
  initialState: initialState,
  reducers: {
    cityListSuccess: (state, action) => {
      state.cityList = action.payload;
    },
    cityListFailed: (state, action) => {
      state.cityList = [];
    },
    cityDetailSuccess: (state, action) => {
      state.cityDetail = action.payload;
    },
    cityDetailFailed: (state, action) => {
      state.cityDetail = [];
    },
  },
});

export const {
  cityListSuccess,
  cityListFailed,
  cityDetailSuccess,
  cityDetailFailed,
} = citySlice.actions;
export default citySlice.reducer;
