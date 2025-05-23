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
import { useMutation } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const r = [
  { value: "admin", label: "Admin" },
  { value: "student", label: "Siswa" },
  { value: "teacher", label: "Guru" },
  { value: "parent", label: "Orangtua" },
];
const formSchema = z.object({
  username: z.string().min(3, "Nama Pengguna harus diisi"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[a-z]/, "Harus ada huruf kecil")
    .regex(/[A-Z]/, "Harus ada huruf besar")
    .regex(/[0-9]/, "Harus ada angka")
    .regex(/[^A-Za-z0-9]/, "Harus ada simbol"),
  role: z.enum(["admin", "student", "teacher", "parent"], "Pilih Role", {
    required_error: "Role wajib dipilih",
  }),
});

export default function NewUserForm({ callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "",
      password: ""
    },
  });

  const createUser = useMutation({
    mutationKey: ["user-add"],
    mutationFn: async (values) =>
      await authAxios.post("/auth/dashboard/user", values, {
        headers: { "Content-Type": "application/json" },
      }),
    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal menambahkan pengguna.";
      toast.error(msg);
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menambahkan pengguna");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createUser.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pengguna</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Kata Sandi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select {...field} className="border p-2 rounded w-full">
                  <option value="">Pilih Role</option>
                  {r.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={createUser.isPending} type="submit">
          {createUser.isPending ? "Menambahkan..." : "Tambah Pengguna"}
        </Button>
      </form>
    </Form>
  );
}
