import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookingsList: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    bookingsListSuccess: (state, action) => {
      state.bookingsList = action.payload;
    },
    bookingsListFailed: (state) => {
      state.bookingsList = [];
    }, 
  },
});

export const { bookingsListSuccess, bookingsListFailed } = bookingSlice.actions;
export default bookingSlice.reducer;