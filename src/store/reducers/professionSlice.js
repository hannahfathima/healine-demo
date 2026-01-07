import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  professionsList: [],
  professionDetail: null,
  professionsForSelectList: [],
};
const professionSlice = createSlice({
  name: "profession",
  initialState: initialState,
  reducers: {
    professionsListSuccess: (state, action) => {
      state.professionsList = action.payload;
    },
    professionsListFailed: (state, action) => {
      state.professionsList = [];
    },
    professionsDetailSuccess: (state, action) => {
      state.professionDetail = action.payload;
    },
    professionsDetailFailed: (state, action) => {
      state.professionDetail = [];
    },
    professionsForSelectListSuccess: (state, action) => {
      state.professionsForSelectList = action.payload;
    },
    professionsForSelectListFailed: (state, action) => {
      state.professionsForSelectList = [];
    },
  },
});

export const {
  professionsListSuccess,
  professionsListFailed,
  professionsDetailSuccess,
  professionsDetailFailed,
  professionsForSelectListSuccess,
  professionsForSelectListFailed,
} = professionSlice.actions;
export default professionSlice.reducer;
