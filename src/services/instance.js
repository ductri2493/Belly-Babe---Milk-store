import axios from "axios";

export const instance = axios.create({
  baseURL: "https://api.bellybabe.site/api/",
    // baseURL: "https://6628fc7754afcabd0737b9e2.mockapi.io/",
  // baseURL: "https://localhost:7256/api/"
});

instance.interceptors.response.use(function (response) {
  return response.data;
});
