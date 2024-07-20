import { createSlice } from "@reduxjs/toolkit";
import { adminLogin } from "./auth.thunk";

const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;
// console.log(userToken)

const initialState = {
  loading: false,
  userInfo: {},
  userToken,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.userInfo = {};
      state.userToken = null;
      localStorage.removeItem('userToken');
      localStorage.clear()
    },
    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload;
        state.userToken = payload.token;
        state.success = true;
        localStorage.setItem('userToken', payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
