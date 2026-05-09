import { createSlice } from "@reduxjs/toolkit";

const flipSlice = createSlice({
  name: "flip",
  initialState: {
    flipData: [],
  },
  reducers: {
    setFlipData: (state, action) => {
      state.flipData = action.payload;
    },
  },
});

export const { setFlipData } = flipSlice.actions;
export default flipSlice.reducer;
