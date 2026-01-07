import { createSlice } from "@reduxjs/toolkit";

const localUserData = JSON.parse(localStorage.getItem("userDetails") || "{}");

const initialState = {
  userInfo: localUserData ? localUserData : null,
  userToken: localUserData ? localUserData.token : "",
  userModules: localUserData?.role?.permissions?.map(p => p.module) || [],
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
      // Extract modules from role.permissions array
      state.userModules = action.payload.role?.permissions?.map(p => p.module) || [];
    },
    logOutSuccess: (state, action) => {
      state.userInfo = null;
      state.userToken = "";
      state.userModules = [];
    },
  },
});

export const { loginSuccess, logOutSuccess } = authSlice.actions;
export default authSlice.reducer;