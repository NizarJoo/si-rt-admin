"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
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
// import { createFormData } from "@/lib/utils";
import Select from "react-select";
// import { useParams } from "next/navigation";


// Validasi pakai Zod
const formSchema = z.object({
  mata_pelajaran: z.string().min(3, "Nama mata pelajaran harus diisi"),
  teacher: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Guru harus dipilih" }
  ),
  date: z.string().min(1, "Tanggal jurnal harus diisi"),
  time_start: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Wajib diisi")
  ),
  time_end: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Wajib diisi")
  ),
  description: z.string().min(10, "Deskripsi harus lebih dari 10 karakter"),
});

export default function NewJournalForm({ classId, callback }) {
  const authAxios = useAuthAxios();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 useEffect(() => {
 }, [classId]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mata_pelajaran: "",
      date: "",
      time_start: "",
      time_end: "",
      description: "",
      teacher: null,
    },
  });

  // Fetch data guru
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

  // Mutation untuk create jurnal
  const createJournal = useMutation({
    mutationKey: ["journal-add"],
    mutationFn: async (values) => {
      await authAxios.post(`/auth/dashboard/journal/classes/${classId}`, {
        mata_pelajaran: values.mata_pelajaran,
        date: values.date,
        time_start: values.time_start,
        time_end: values.time_end,
        description: values.description,
        teacher_id: values.teacher.value,
      });
    },

    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal menambahkan jurnal.";
      toast.error(msg);
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menambahkan jurnal");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          createJournal.mutate(values);
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
          name="description"
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
          disabled={createJournal.isPending}
          type="submit"
          className="w-full"
        >
          {createJournal.isPending ? "Menambahkan..." : "Tambah Jurnal"}
        </Button>
      </form>
    </Form>
  );
}
