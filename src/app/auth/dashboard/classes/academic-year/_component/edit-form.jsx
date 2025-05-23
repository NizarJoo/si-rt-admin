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


export default function EditYear({ currentValue, id }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year_start: currentValue.year_start ?? "",
      year_end: currentValue.year_end ?? "",
    },
  });

  const queryClient = useQueryClient();
  const editYearMutation = useMutation({
    mutationKey: ["year-edit", id],
    mutationFn: async (values) => {
      return await authAxios.put(`/auth/dashboard/classes/academic-year/${id}`, values);
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan"
        : "Gagal mengirim data.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Berhasil mengubah tahun akademik");
      queryClient.refetchQueries({ queryKey: ["year-list"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          editYearMutation.mutate(values)
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="year_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun dimulai</FormLabel>
              <FormControl>
                <Input {...field} disabled={editYearMutation.isPending} />
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
              <FormLabel>Tahun diakhiri</FormLabel>
              <FormControl>
                <Input {...field} disabled={editYearMutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={editYearMutation.isPending} type="submit">
          {editYearMutation.isPending ? "Mengubah..." : "Simpan Perubahan"}
        </Button>
      </form>
    </Form>
  );
}
