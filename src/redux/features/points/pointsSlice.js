import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  points: 0,
};

const pointsSlice = createSlice({
  name: "points",
  initialState,
  reducers: {
    updatePoints: (state, action) => {
      state.points += action.payload;
    },
    usePoints: (state, action) => {
      state.points -= action.payload;
    },
  },
});

export const { updatePoints, usePoints } = pointsSlice.actions;

export default pointsSlice.reducer;
