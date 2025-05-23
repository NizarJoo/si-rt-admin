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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

// Validasi schema pakai Zod
const formSchema = z.object({
  student_name: z.string().min(3, "Nama siswa harus diisi"),
  nis: z.string().min(6, "NIS minimal 6 karakter"),
  phone_number: z.string().min(10, "Nomor HP minimal 10 karakter"),
  parent: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Orang tua wajib dipilih" }
  ),
  class: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Kelas wajib dipilih" }
  ),
});

// Komponen Input reusable
const InputField = ({ name, label, control }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function EditStudent({ currentValue, id }) {
  const authAxios = useAuthAxios();
  const queryClient = useQueryClient();

  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch parent & class options
  const fetchOptions = async () => {
    try {
      const [parentRes, classRes] = await Promise.all([
        authAxios.get("/auth/dashboard/parent"),
        authAxios.get("/auth/dashboard/classes"),
      ]);

      setParents(
        (parentRes.data.data || []).map((item) => ({
          value: item.id,
          label: item.parent_name,
        }))
      );

      setClasses(
        (classRes.data.data || []).map((item) => ({
          value: item.id,
          label: `${item.grade.grade_name} (${item.academic_year.year_start}/${item.academic_year.year_end})`,
        }))
      );
    } catch (error) {
      toast.error("Gagal memuat data form");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_name: currentValue.student_name ?? "",
      nis: currentValue.nis ?? "",
      phone_number: currentValue.phone_number ?? "",
      parent: currentValue.parent_id
        ? {
            value: currentValue.parent_id,
            label: currentValue.parent_name,
          }
        : null,
      class:
        currentValue.grade_history && currentValue.grade_history.length > 0
          ? {
              value: currentValue.grade_history[0].grade_year_teacher_id,
              label: `${currentValue.grade_history[0].grade_name} (${currentValue.grade_history[0].academic_year_start}/${currentValue.grade_history[0].academic_year_end})`,
            }
          : null,
    },
  });

  const editStudentMutation = useMutation({
    mutationKey: ["student-edit", id],
    mutationFn: async (values) => {
      const payload = {
        student_name: values.student_name,
        nis: values.nis,
        phone_number: values.phone_number,
        parent_id: values.parent.value,
        grade_year_teacher_id: values.class.value,
      };
      return await authAxios.put(`/auth/dashboard/student/${id}`, payload);
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan"
        : "Gagal mengirim data.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Berhasil mengubah data siswa");
      queryClient.refetchQueries({ queryKey: ["student-list"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          editStudentMutation.mutate(values)
        )}
        className="space-y-4"
      >
        <InputField
          name="student_name"
          label="Nama Siswa"
          control={form.control}
        />
        <InputField
          name="nis"
          label="Nomor Induk Siswa"
          control={form.control}
        />
        <InputField
          name="phone_number"
          label="Nomor HP"
          control={form.control}
        />

        {/* Select Parent */}
        <FormField
          control={form.control}
          name="parent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orang Tua</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  options={parents}
                  isLoading={isLoading}
                  placeholder="Pilih Orang Tua"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Class */}
        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelas</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  options={classes}
                  isLoading={isLoading}
                  placeholder="Pilih Kelas"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={editStudentMutation.isPending} type="submit">
          {editStudentMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </Form>
  );
}
