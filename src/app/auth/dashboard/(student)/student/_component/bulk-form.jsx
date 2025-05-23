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
import { createFormData } from "@/lib/utils";

const csvType = [".csv", "text/csv"];

const formSchema = z.object({
  file: z
    .instanceof(File, { message: "Wajib upload file CSV" })
    .refine((file) => file.type === "text/csv", {
      message: "File harus berupa CSV",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Ukuran maksimal 10MB",
    }),
});

export default function NewUserBulkForm({ callback }) {
  const authAxios = useAuthAxios();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

    const createUserBulk = useMutation({
      mutationKey: ["student-bulk"],
      mutationFn: async (values) => {
        const formData = createFormData(values); 
        return await authAxios.post("/auth/dashboard/student/csv", formData); 
      },
      onError(error) {
        toast.error(
          isAxiosError(error)
            ? error.response?.data?.status?.message || "Gagal menambahkan siswa"
            : "Terjadi kesalahan."
        );
        callback();
      },
      onSuccess() {
        toast.success("Berhasil mengupload file CSV!");
        form.reset();
        callback();
      },
    });

  function onSubmit(values) {
    createUserBulk.mutate(values);
  }

 return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, ...fieldValues } }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept=".csv, text/csv"
                  {...fieldValues}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    fieldValues.onChange(file ?? null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={createUserBulk.isPending} type="submit">
          {createUserBulk.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );

}