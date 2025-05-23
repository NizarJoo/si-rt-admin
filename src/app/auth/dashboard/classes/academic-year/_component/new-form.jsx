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
  year_start: z.preprocess(
    (val) => Number(val),
    z.number().refine((val) => val.toString().length === 4, {
      message: "Tahun akademik harus 4 angka",
    })
  ),
  year_end: z.preprocess(
    (val) => Number(val),
    z.number().refine((val) => val.toString().length === 4, {
      message: "Tahun akademik harus 4 angka",
    })
  ),
});

export default function NewYearForm({ callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year_start: "",
      year_end: "",
    },
  });

  const createYear = useMutation({
    mutationKey: ["year-add"],
    mutationFn: async (values) =>
      await authAxios.post("/auth/dashboard/classes/academic-year", values, {
        headers: { "Content-Type": "application/json" },
      }),
    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal menambahkan tahun akademik.";
      toast.error(msg);
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menambahkan tahun akademik");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createYear.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="year_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Dimulai</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Diakhiri</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={createYear.isPending} type="submit">
          {createYear.isPending ? "Menambahkan..." : "Tambah Tahun"}
        </Button>
      </form>
    </Form>
  );
}
