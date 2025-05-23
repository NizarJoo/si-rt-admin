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
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { createFormData } from "@/lib/utils";


// Skema validasi menggunakan Zod
const formSchema = z.object({
  event_name: z.string().min(3, "Nama kegiatan harus diisi"),
  date: z.string().min(1, "Tanggal kegiatan harus diisi"),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "Wajib upload gambar",
    })
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(files[0]?.type),
      {
        message: "File harus berupa gambar jpg/png",
      }
    )
    .refine((files) => files[0]?.size <= 10 * 1024 * 1024, {
      message: "Ukuran maksimal 10MB",
    }),

  description: z.string().min(10, "Deskripsi harus lebih dari 10 karakter"),
});

export default function NewEventForm({ callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "", 
      date: "",
      image: undefined,
      description: "",
    },
  });

  const createEvent = useMutation({
    mutationKey: ["event-add"],
    mutationFn: async (values) => {
      const formData = createFormData (values);
      await authAxios.post("/auth/dashboard/event", formData)},
      
    
      onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal menambahkan kegiatan.";
      toast.error(msg);
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menambahkan kegiatan");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => {
            createEvent.mutate(values);
          },
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="event_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Kegiatan</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto Kegiatan</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Kegiatan</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={createEvent.isPending} type="submit">
          {createEvent.isPending ? "Menambahkan..." : "Tambah Kegiatan"}
        </Button>
      </form>
    </Form>
  );
}
