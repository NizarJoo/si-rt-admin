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

// Skema validasi menggunakan Zod
const formSchema = z.object({
  nama_kegiatan: z.string().min(3, "Nama kegiatan harus diisi"),
  tanggal_kegiatan: z.string().min(1, "Tanggal kegiatan harus diisi"),
  foto_kegiatan: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Foto kegiatan harus diunggah"),
  deskripsi_kegiatan: z
    .string()
    .min(10, "Deskripsi harus lebih dari 10 karakter"),
});

export default function NewKegiatanForm({ callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_kegiatan: "",
      tanggal_kegiatan: "",
      foto_kegiatan: undefined,
      deskripsi_kegiatan: "",
    },
  });

  const createKegiatan = useMutation({
    mutationKey: ["create-kegiatan"],
    mutationFn: async (values) => {
      const formData = new FormData();
      formData.append("nama_kegiatan", values.nama_kegiatan);
      formData.append("tanggal_kegiatan", values.tanggal_kegiatan);
      formData.append("foto_kegiatan", values.foto_kegiatan[0]);
      formData.append("deskripsi_kegiatan", values.deskripsi_kegiatan);

      return await authAxios.post("/kegiatan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onError(error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data["status"]["message"]
          : error.message
      );
    },
    onSuccess() {
      callback();
      toast.success("Berhasil menambahkan kegiatan");
    },
  });

  function onSubmit(values) {
    createKegiatan.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama_kegiatan"
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
          name="tanggal_kegiatan"
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
          name="foto_kegiatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto Kegiatan</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deskripsi_kegiatan"
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

        <Button disabled={createKegiatan.isPending} type="submit">
          {createKegiatan.isPending ? "Menambahkan..." : "Tambah Kegiatan"}
        </Button>
      </form>
    </Form>
  );
}
