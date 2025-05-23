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
import { useQueryClient } from "@tanstack/react-query";

const GENDER_OPTIONS = [
  {value: "male", label: "Laki-laki"},
  {value: "female", label: "Perempuan"}];

const formSchema = z.object({
  teacher_name: z.string().min(3, "Nama Guru harus diisi"),
  id_number: z.string().min(6, "NIP harus minimal 6 digit"),
  address: z.string().min(3, "Alamat harus diisi"),
  phone_number: z.string().min(10, "Nomor HP harus minimal 10 digit"),
  gender: z.enum(["male", "female"]),
});

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

export default function EditTeacher({ currentValue, id }) {
  const authAxios = useAuthAxios();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacher_name: currentValue.teacher_name ?? "",
      id_number: currentValue.id_number ?? "",
      address: currentValue.address ?? "",
      phone_number: currentValue.phone_number ?? "",
      gender: currentValue.gender ?? "",
    },
  });

  const queryClient = useQueryClient();

  const editTeacherMutation = useMutation({
    mutationKey: ["teacher-edit", id],
    mutationFn: async (values) => {
      return await authAxios.put(
        `/auth/dashboard/teacher-profil/${id}`,
        values
      );
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan"
        : "Gagal mengirim data.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Berhasil mengubah data guru");
      queryClient.refetchQueries({ queryKey: ["teacher-list"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          editTeacherMutation.mutate(values)
        )}
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
          control={form.control}
          options={GENDER_OPTIONS}
        />
        <InputField name="address" label="Alamat" control={form.control} />
        <InputField
          name="phone_number"
          label="Nomor HP"
          control={form.control}
        />

        <Button
          disabled={editTeacherMutation.isPending}
          type="submit"
        >
          {editTeacherMutation.isPending ? "Mengubah..." : "Simpan Perubahan"}
        </Button>
      </form>
    </Form>
  );
}
