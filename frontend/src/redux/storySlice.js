import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: null,
    allStoriesData:[]
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },
    setAllStoriesData: (state, action) => {
      state.allStoriesData = action.payload;
    },
  },
});

export const { setStoryData,setAllStoriesData } = storySlice.actions;
export default storySlice.reducer;
