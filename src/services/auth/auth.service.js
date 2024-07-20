import { instance } from "../instance";

//CALL API LOCAL

export const sendOtp = async (phoneNumber, userName) => {
  try {
    const response = await instance.post("UserLogin/request-otp", {
      phoneNumber,
      userName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    // throw error;
  }
};

export const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await instance.post(`UserLogin/verify-otp`, {
      otp,
      phoneNumber,
    });
    console.log("Response from verifyOtp:", response);
    const token = response.token;
    const userID = response.userID;
    if (userID && token) {
      return {
        userID,
        token,
      };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// CALL API SERVER DEPLOY
// export const sendOtp = async (phoneNumber, userName) => {
//   try {
//     const response = await instance.post(`request-otp`, {
//       phoneNumber,
//       userName,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw error;
//   }
// };

// export const verifyOtp = async (otp) => {
//   try {
//     const response = await instance.post(`verify-otp`, {
//       otp,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     throw error;
//   }
// };

const loginAdmin = async (email, password) => {
  const response = await instance.post(`AdminLogin/login`, {
    email,
    password,
  });
  // console.log("loginAdmin", response.data)
  // console.log(response.email)
  if (response.email) {
    localStorage.setItem("user", JSON.stringify(response));
  }
  // console.log('response', response)
  return response;
};

const logoutAdmin = async () => {
  const response = localStorage.removeItem("user");
  return response;
};

const getCurrentUserAdmin = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthServices = {
  loginAdmin,
  logoutAdmin,
  getCurrentUserAdmin,
};

export default AuthServices;
