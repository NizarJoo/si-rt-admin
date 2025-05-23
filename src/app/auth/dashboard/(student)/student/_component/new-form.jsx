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
import { useState, useEffect } from "react";
import Select from "react-select";

// Skema validasi pakai Zod
const formSchema = z.object({
  student_name: z.string().min(3, "Nama siswa harus diisi"),
  nis: z.string().min(6, "NIS minimal 6 karakter"),
  phone_number: z.string().min(10, "Nomor HP minimal 10 karakter"),
  class: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Kelas wajib dipilih" }
  ),
});

// Komponen input reusable
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

export default function NewStudentForm({ callback }) {
  const authAxios = useAuthAxios();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data kelas
  const fetchOptions = async () => {
    try {
      const classRes = await authAxios.get("/auth/dashboard/classes");

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
      student_name: "",
      nis: "",
      phone_number: "",
      class: null,
    },
  });

  const createStudent = useMutation({
    mutationKey: ["student-add"],
    mutationFn: async (values) => {
      const payload = {
        student_name: values.student_name,
        nis: values.nis,
        phone_number: values.phone_number,
        grade_year_teacher_id: values.class.value,
      };
      return await authAxios.post("/auth/dashboard/student", payload, {
        headers: { "Content-Type": "application/json" },
      });
    },
    onError(error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.status?.message || "Terjadi kesalahan."
          : "Gagal menambahkan Siswa."
      );
    },
    onSuccess() {
      callback();
      toast.success("Berhasil menambahkan siswa");
      form.reset(); // reset form setelah berhasil
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createStudent.mutate(values))}
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

        <Button disabled={createStudent.isPending} type="submit">
          {createStudent.isPending ? "Menambahkan..." : "Tambah Siswa"}
        </Button>
      </form>
    </Form>
  );
}
