import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { verifyOtp } from "../../../../services/auth/auth.service";
import { setMessage } from "../../messagesSlice";
import { AuthContext } from "../../../../context/AuthContextUser";

const initialState = {
  isLoggedIn: false,
  user: null,
  userInfo: {
    name: '',
    email: '',
    phone: ''
  },
};

export const loginWithOTP = createAsyncThunk(
  "user/loginWithOTP",
  async ({ phoneNumber, otp }, thunkAPI) => {
    try {
      const verifyResponse = await verifyOtp(phoneNumber, otp);
      const { userId, token } = verifyResponse.data;
      thunkAPI.dispatch(setMessage(verifyResponse.message));
      const user = {
        userId,
        phoneNumber,
      };
      console.log("Logged in userId:", userId);
      console.log("Token:", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      return { user };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  await AuthContext.logout();
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = initialState.userInfo;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithOTP.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(loginWithOTP.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});
export const { saveUserInfo } = userSlice.actions;
export default userSlice.reducer;
