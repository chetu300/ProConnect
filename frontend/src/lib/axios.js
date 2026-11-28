import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "/api/v1"
    : import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
