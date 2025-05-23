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

const formSchema = z.object({
  grade_name: z.string().min(3, "Nama Kelas harus diisi"),
});

export default function EditGrade({ currentValue, id }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade_name: currentValue.grade_name ?? "",
    },
  });

  const queryClient = useQueryClient();
  const editGradeMutation = useMutation({
    mutationKey: ["grade-edit", id],
    mutationFn: async (values) => {
      return await authAxios.put(`/auth/dashboard/classes/grade/${id}`, values);
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan"
        : "Gagal mengirim data.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Berhasil mengubah data kelas");
      queryClient.refetchQueries({ queryKey: ["grade-list"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          editGradeMutation.mutate(values)
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="grade_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kelas</FormLabel>
              <FormControl>
                <Input {...field} disabled={editGradeMutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={editGradeMutation.isPending} type="submit">
          {editGradeMutation.isPending ? "Mengubah..." : "Simpan Perubahan"}
        </Button>
      </form>
    </Form>
  );
}
