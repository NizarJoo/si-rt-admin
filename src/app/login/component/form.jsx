"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import axios, { isAxiosError } from "axios";
import { setCookie } from "nookies";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_URL = "https://si-erte-production.up.railway.app";

// Schema validasi form pakai zod
const formSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

// Fungsi request login ke API
const loginRequest = async (values) => {
  const response = await axios.post(`${API_URL}/login`, values);
  return response.data;
};

export default function LoginForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "admin",
      password: "password",
    },
  });

  const onSubmit = async (values) => {
    try {
      console.log("Mengirim data ke API:", values);
      const { access_token, refresh_token } = await loginRequest(values);
      console.log("Token diterima:", { access_token, refresh_token });

      if (!access_token || !refresh_token) {
        throw new Error("Token tidak ditemukan dalam response API.");
      }

      // Simpan token ke cookie
      setCookie(null, "access_token", access_token, {
        maxAge: 24 * 60 * 60,
        path: "/",
      });
      setCookie(null, "refresh_token", refresh_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      toast.success("Login berhasil!");
      router.push("/auth/dashboard/school");
    } catch (error) {
      console.error("Error saat login:", error);

      let errorMessage = "Terjadi kesalahan saat login";

      if (isAxiosError(error)) {
        const apiMessage =
          error.response?.data?.message ||
          error.response?.data?.status?.message ||
          error.response?.data?.error; // antisipasi variasi struktur response

        errorMessage = apiMessage || "Username atau password salah";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-2xl mx-auto w-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan Username" type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full flex items-center justify-center gap-2"
        >
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
}
