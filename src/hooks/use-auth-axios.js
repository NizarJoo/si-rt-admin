"use client";

import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

const useAuthAxios = () => {
  const router = useRouter();

  const authAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  // Interceptor untuk menambahkan token dari cookies ke header
  authAxios.interceptors.request.use(
    (config) => {
      const cookies = parseCookies();
      const token = cookies["access_token"];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor untuk menangani error 401 (Unauthorized)
  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          const cookies = parseCookies();
          const refreshToken = cookies["refresh_token"];

          if (refreshToken) {
            try {
              // Kirim permintaan untuk mendapatkan access token baru
              const refreshResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                { refresh_token: refreshToken }
              );

              const accessToken = refreshResponse.data.data.token_string;

              // Simpan token baru ke cookies
              setCookie(null, "access_token", accessToken, {
                maxAge: 7 * 24 * 60 * 60, // 7 hari
                path: "/",
              });

              // Update request original dengan token baru
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;

              // Ulangi request yang sebelumnya gagal
              return authAxios(originalRequest);
            } catch (refreshError) {
              // Hapus cookies dan arahkan user ke halaman login jika gagal refresh token
              destroyCookie(null, "access_token");
              destroyCookie(null, "refresh_token");
              router.push("/login");
              return Promise.reject(refreshError);
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return authAxios;
};

export default useAuthAxios;
