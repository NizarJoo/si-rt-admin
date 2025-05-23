import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Menggunakan environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
