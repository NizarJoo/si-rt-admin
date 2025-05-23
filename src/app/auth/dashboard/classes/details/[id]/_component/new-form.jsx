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
import { useMutation } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Select from "react-select";

const formSchema = z.object({
  student_id: z.string().min(1, { message: "Pilih siswa terlebih dahulu." }),
});

export default function NewStudentClass({
  classId,
  studentOptions,
  callback,
}) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: "",
    },
  });

  const createStudentClass = useMutation({
    mutationKey: ["student-class-add"],
    mutationFn: async (values) =>
      await authAxios.post(
        "/auth/dashboard/classes/details",
        {
          grade_year_teacher_id: classId,
          ...values,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      ),
    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan."
        : "Gagal menambahkan siswa ke kelas.";
      toast.error(msg);
    },
    onSuccess: () => {
      callback();
      form.reset();
      toast.success("Berhasil menambahkan siswa ke kelas");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          createStudentClass.mutate(values)
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="student_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Siswa</FormLabel>
              <FormControl>
                <Select
                  options={studentOptions}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e.id}
                  onChange={(selected) => field.onChange(selected.id)}
                  placeholder="Pilih siswa..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={createStudentClass.isPending} type="submit">
          {createStudentClass.isPending ? "Menambahkan..." : "Tambah Siswa"}
        </Button>
      </form>
    </Form>
  );
}
