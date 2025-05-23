"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Select from "react-select";

// Skema validasi
const formSchema = z.object({
  mata_pelajaran: z.string().min(3, "Nama mata pelajaran harus diisi"),
  teacher: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Guru harus dipilih" }
  ),
  time_start: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Wajib diisi")
  ),
  time_end: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Wajib diisi")
  ),
  deskripsi: z.string().min(10, "Deskripsi harus lebih dari 10 karakter"),
});

export default function EditJournal({ currentValue, classId, callback }) {
  const authAxios = useAuthAxios();
  const queryClient = useQueryClient();

  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mata_pelajaran: currentValue.mata_pelajaran ?? "",
      date: currentValue.date ?? "",
      time_start: currentValue.time_start ?? "",
      time_end: currentValue.time_end ?? "",
      deskripsi: currentValue.deskripsi ?? "",
      teacher: currentValue.teacher
        ? {
            value: currentValue.teacher.id,
            label: currentValue.teacher.teacher_name,
          }
        : null,
    },
  });

  const fetchOptions = async () => {
    setIsLoading(true);
    try {
      const res = await authAxios.get("/auth/dashboard/teacher-profil");
      setTeachers(
        (res.data || []).map((item) => ({
          value: item.id,
          label: item.teacher_name,
        }))
      );
    } catch (error) {
      toast.error("Gagal memuat data guru");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const EditJournalMutation = useMutation({
    mutationKey: ["journal-edit"],
    mutationFn: async (values) => {
      await authAxios.post(`/auth/dashboard/journal/classes/${classId}`, {
        mata_pelajaran: values.mata_pelajaran,
        date: values.date,
        time_start: values.time_start,
        time_end: values.time_end,
        deskripsi: values.deskripsi,
        teacher_id: values.teacher.value,
      });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal mengedit jurnal.";
      toast.error(message);
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil mengedit jurnal");
      queryClient.refetchQueries({ queryKey: ["journal-list"] });
    },
  });

  useEffect(() => {
    console.log("currentValue:", currentValue);
  }, [currentValue]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          EditJournalMutation.mutate(values);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="mata_pelajaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mata Pelajaran</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Contoh: Matematika" />
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
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacher"
          render={() => (
            <FormItem>
              <FormLabel>Pilih Guru</FormLabel>
              <FormControl>
                <Controller
                  name="teacher"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      options={teachers}
                      isLoading={isLoading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Pilih Guru"
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="time_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Mulai</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="7" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Selesai</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Contoh: Membahas materi pecahan dan latihan soal."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={EditJournalMutation.isPending}
          type="submit"
          className="w-full"
        >
          {EditJournalMutation.isPending ? "Menyimpan..." : "Simpan Jurnal"}
        </Button>
      </form>
    </Form>
  );
}
