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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const r = [
  { value: "admin", label: "Admin" },
  { value: "student", label: "Siswa" },
  { value: "teacher", label: "Guru" },
  { value: "parent", label: "Orangtua" },
];
const formSchema = z.object({
  username: z.string().min(3, "Nama Pengguna harus diisi"),
  role: z.enum(["Admin", "Student", "Teacher", "Parent"], "Pilih Role", {
    required_error: "Role wajib dipilih",
  }),
});

export default function EditUser({ currentValue, id }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentValue.username ?? "",
      role: currentValue.role ?? "",
    },
  });

  const queryClient = useQueryClient();
  const editUserMutation = useMutation({
    mutationKey: ["user-edit", id],
    mutationFn: async (values) => {
      return await authAxios.put(`/auth/dashboard/user/${id}`, values);
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan"
        : "Gagal mengirim data.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Berhasil mengubah data pengguna");
      queryClient.refetchQueries({ queryKey: ["user-list"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          editUserMutation.mutate(values)
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pengguna</FormLabel>
              <FormControl>
                <Input {...field} disabled={editUserMutation.isPending} />
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

        <Button disabled={editUserMutation.isPending} type="submit">
          {editUserMutation.isPending ? "Mengubah..." : "Simpan Perubahan"}
        </Button>
      </form>
    </Form>
  );
}
