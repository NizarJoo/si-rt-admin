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

// Konstanta
const GENDER_OPTIONS = [
  {value: "male", label: "Laki-laki"}, 
  {value: "female", label: "Perempuan"}];

// Validasi Zod
const formSchema = z.object({
  teacher_name: z.string().min(3, "Nama Guru harus diisi"),
  id_number: z.string().min(18, "NIP harus minimal 18 digit"),
  address: z.string().min(3, "Alamat harus diisi"),
  phone_number: z.string().min(10, "Nomor HP harus minimal 10 digit"),
  gender: z.enum(["male", "female"], "Pilih Jenis Kelamin"),
});

// Reusable Field: Input
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
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function NewTeacherForm({ callback }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacher_name: "",
      id_number: "",
      address: "",
      phone_number: "",
      gender: "male",
    },
  });

  const createTeacher = useMutation({
    mutationKey: ["teacher-add"],
    mutationFn: async (values) =>
      await authAxios.post("/auth/dashboard/teacher-profil", values, {
        headers: { "Content-Type": "application/json" },
      }),
    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal menambahkan Guru.";
      toast.error(msg);
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menambahkan Guru");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createTeacher.mutate(values))}
        className="space-y-4"
      >
        <InputField
          name="teacher_name"
          label="Nama Guru"
          control={form.control}
        />
        <InputField
          name="id_number"
          label="Nomor Induk Pegawai"
          control={form.control}
        />
        <SelectField
          name="gender"
          label="Jenis Kelamin"
          options={GENDER_OPTIONS}
          control={form.control}
        />
        <InputField 
        name="address" 
        label="Alamat" 
        control={form.control} 
        />
        <InputField
          name="phone_number"
          label="Nomor HP"
          control={form.control}
        />

        <Button disabled={createTeacher.isPending} type="submit">
          {createTeacher.isPending ? "Menambahkan..." : "Tambah Guru"}
        </Button>
      </form>
    </Form>
  );
}
