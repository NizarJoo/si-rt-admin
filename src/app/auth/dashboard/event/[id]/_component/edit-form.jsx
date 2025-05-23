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
import { useQueryClient } from "@tanstack/react-query";
import { createFormData } from "@/lib/utils";

// Skema validasi dengan Zod
const formSchema = z.object({
  event_name: z.string().min(3, "Nama kegiatan harus diisi"),
  date: z.string().min(1, "Tanggal kegiatan harus diisi"),
  image: z
    .any()
    .refine(
      (files) =>
        files instanceof FileList
          ? files.length === 0 ||
            ["image/jpeg", "image/jpg", "image/png"].includes(files[0]?.type)
          : true,
      { message: "File harus berupa gambar jpg/png" }
    ),

  description: z.string().min(10, "Deskripsi harus lebih dari 10 karakter"),
});

export default function EditEvent({ currentValue, id, callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: currentValue.event_name ?? "",
      date: currentValue.date ?? "",
      image: null,
      description: currentValue.description ?? "",
    },
  });

  const queryClient = useQueryClient();
  const editEventMutation = useMutation({
    mutationKey: ["event-edit", id],
    mutationFn: async (values) => {
      console.log(values);

      const formData = createFormData(values);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      return await authAxios.put(`/auth/dashboard/event/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onError: (error) => {
      console.log(error)
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan"
        : "Gagal mengirim data.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Berhasil mengubah data guru");
      queryClient.invalidateQueries({ queryKey: ["event-list"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          editEventMutation.mutate(values);
        })}
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
                <div>
                  {currentValue.image &&
                    typeof currentValue.image === "string" && (
                      <img
                        src={
                          currentValue.image?.startsWith("http")
                            ? currentValue.image
                            : `https://si-erte-production.up.railway.app/${currentValue.image}`
                        }
                        alt="Preview Kegiatan"
                        className="mb-2 max-h-40 rounded-md"
                      />
                    )}
                  <Input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </div>
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

        <Button disabled={editEventMutation.isPending} type="submit">
          {editEventMutation.isPending ? "Menyimpan" : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}
