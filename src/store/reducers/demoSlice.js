// store/reducers/demoLoginSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  demoLoginList: [],
  currentDemoLogin: null,
};

const demoLoginSlice = createSlice({
  name: "demoLogin",
  initialState,
  reducers: {
    demoLoginListSuccess: (state, action) => {
      state.demoLoginList = action.payload;
    },
    demoLoginListFailed: (state) => {
      state.demoLoginList = [];
    },
    demoLoginDetailSuccess: (state, action) => {
      state.currentDemoLogin = action.payload;
    },
    demoLoginDetailFailed: (state) => {
      state.currentDemoLogin = null;
    },
  },
});

export const { 
  demoLoginListSuccess, 
  demoLoginListFailed,
  demoLoginDetailSuccess,
  demoLoginDetailFailed 
} = demoLoginSlice.actions;
export default demoLoginSlice.reducer;