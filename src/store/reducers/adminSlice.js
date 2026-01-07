import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admins: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdmins: (state, action) => {
      state.admins = action.payload.rows || [];
      state.totalCount = action.payload.count || 0;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setAdmins, setError, clearError } = adminSlice.actions;
export default adminSlice.reducer;