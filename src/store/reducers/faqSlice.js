import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  faqsList: [],
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    faqsListSuccess: (state, action) => {
      state.faqsList = action.payload;
    },
    faqsListFailed: (state) => {
      state.faqsList = [];
    },
  },
});

export const { faqsListSuccess, faqsListFailed } = faqSlice.actions;
export default faqSlice.reducer;