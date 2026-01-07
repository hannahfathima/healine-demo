import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bannersList: [],
  bannerDetail: null,
};
const bannerSlice = createSlice({
  name: "banner",
  initialState: initialState,
  reducers: {
    bannersListSuccess: (state, action) => {
      state.bannersList = action.payload;
    },
    bannersListFailed: (state, action) => {
      state.bannersList = [];
    },
    bannerDetailSuccess: (state, action) => {
      state.bannerDetail = action.payload;
    },
    bannerDetailFailed: (state, action) => {
      state.bannerDetail = [];
    },
  },
});

export const {
  bannersListSuccess,
  bannersListFailed,
  bannerDetailSuccess,
  bannerDetailFailed,
} = bannerSlice.actions;
export default bannerSlice.reducer;
