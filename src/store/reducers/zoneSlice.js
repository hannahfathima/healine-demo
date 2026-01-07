import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  zoneList: [],
  zoneDetail: null,
};
const zoneSlice = createSlice({
  name: "zone",
  initialState: initialState,
  reducers: {
    zoneListSuccess: (state, action) => {
      state.zoneList = action.payload;
    },
    zoneListFailed: (state, action) => {
      state.zoneList = [];
    },
    zoneDetailSuccess: (state, action) => {
      state.zoneDetail = action.payload;
    },
    zoneDetailFailed: (state, action) => {
      state.zoneDetail = [];
    },
  },
});

export const {
  zoneListSuccess,
  zoneListFailed,
  zoneDetailSuccess,
  zoneDetailFailed,
} = zoneSlice.actions;
export default zoneSlice.reducer;
