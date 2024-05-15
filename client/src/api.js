import axios from "axios";

export const serverApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
});

serverApi.interceptors.request.use((config) => {
  config.headers["Authorization"] = localStorage.getItem("token");
  return config;
});
