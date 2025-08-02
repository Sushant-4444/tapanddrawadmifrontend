import axios from "axios";

const API = axios.create({
  baseURL: "https://node-backend-hsr7.onrender.com/api", // Adjust according to your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to every request in headers.token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.token = `Bearer ${token}`;
  }
  console.log("Request Headers:", config.headers);
  return config;
}, (error) => {
  console.error("Request Error:", error);
  return Promise.reject(error);
});

export default API;
