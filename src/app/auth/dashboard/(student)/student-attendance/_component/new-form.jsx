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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const ATTENDANCE = ["Hadir", "Terlambat", "Izin", "Alpha"]

const formSchema = z.object({
  student_name: z.string().min(3, "Nama Siswa harus diisi"),
  date: z.string().min(1, "Tanggal Presensi harus diisi"),
  grade_year: z.string().min(12, "Kelas dan tahun ajaran harus diisi"),
  status: z.enum([...ATTENDANCE]),
    });

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
    
    // Reusable Field: Select
    const SelectField = ({ name, label, options, control }) => (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <select {...field} className="border p-2 rounded w-full">
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );

export default function NewStudentAttendance({ callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_name: "",
      date: "",
      grade_year: "",
      status: "",
    },
  });

  const createAttendance = useMutation({
    mutationKey: ["create-attendance"],
    mutationFn: async (values) => {
      const formData = new FormData();
      formData.append("student_name", values.student_name);
      formData.append("date", values.date);
      formData.append("grade_year", values.grade_year);
      formData.append("status", values.status);

      return await authAxios.post("/student-attendance", formData, {
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
      toast.success("Berhasil menambahkan presensi");
    },
  });

  function onSubmit(values) {
    createAttendance.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          name="student_name"
          label="Nama Siswa"
          control={form.control}
        />
        <InputField
          name="date"
          label="Tanggal Presensi"
          control={form.control}
        />
        <InputField
          name="grade_year"
          label="Kelas/Tahun Ajaran"
          control={form.control}
        />
        <SelectField
          name="status"
          label="Kehadiran"
          options={ATTENDANCE}
          control={form.control}
        />
        <Button disabled={createAttendance.isPending} type="submit">
          {createAttendance.isPending ? "Menambahkan..." : "Tambah Presensi"}
        </Button>
      </form>
    </Form>
  );
}
