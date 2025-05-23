"use client";

import useAuthAxios from "@/hooks/use-auth-axios";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const authAxios = useAuthAxios();

  // Reset error saat berpindah halaman
  useEffect(() => {
    if (error) setError(undefined);
  }, [pathname]);

  // Ambil data pengguna saat pertama kali aplikasi dibuka
  useEffect(() => {
    authAxios
      .get("/auth/dashboard/school")
      .then((res) => setUser(res.data.data))
      .catch(() => {})
      .finally(() => setInitLoading(false));
  }, []);

  function logout() {
    setLoading(true);
    authAxios
      .get("/web/logout")
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        destroyCookie(null, "access_token");
        destroyCookie(null, "refresh_token");
        setUser(undefined);
        router.replace("/login");
      });
  }

  function isSuperAdmin() {
    return user?.role === "SUPERADMIN";
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      isSuperAdmin,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {initLoading ? (
        <div className="w-full h-svh flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
