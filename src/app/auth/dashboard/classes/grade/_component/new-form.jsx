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

const formSchema = z.object({
  grade_name: z.string().min(3, "Nama Kelas harus diisi"),
});

export default function NewGradeForm({ callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade_name: "",
    },
  });

  const createGrade = useMutation({
    mutationKey: ["grade-add"],
    mutationFn: async (values) =>
      await authAxios.post("/auth/dashboard/classes/grade", values, {
        headers: { "Content-Type": "application/json" },
      }),
    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal menambahkan kelas.";
      toast.error(msg);
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menambahkan kelas");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createGrade.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="grade_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kelas</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={createGrade.isPending} type="submit">
          {createGrade.isPending ? "Menambahkan..." : "Tambah Kelas"}
        </Button>
      </form>
    </Form>
  );
}
