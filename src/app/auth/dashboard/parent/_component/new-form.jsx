"use client";

import { useEffect, useState } from "react";
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
import MultiSelect from "@/components/ui/multi-select";

const formSchema = z.object({
  parent_name: z.string().min(3, "Nama harus diisi"),
  address: z.string().min(3, "Alamat harus diisi"),
  phone_number: z.string().min(10, "Nomor HP minimal 10 digit"),
  student_id: z.array(z.string().uuid(), {
    required_error: "Pilih setidaknya satu siswa",
  }),
});

export default function NewParentForm({ callback }) {
  const authAxios = useAuthAxios();
  const [studentOptions, setStudentOptions] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parent_name: "",
      address: "",
      phone_number: "",
      student_id: [],
    },
  });

  // Fetch student data pas component load
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await authAxios.get("/auth/dashboard/student");
        const options = res.data.data.map((student) => ({
          label: student.student_name,
          value: student.id,
        }));
        setStudentOptions(options);
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data siswa.");
      }
    };

    fetchStudents();
  }, []);

  const createParent = useMutation({
    mutationKey: ["parent-add"],
    mutationFn: async (values) =>
      await authAxios.post("/auth/dashboard/parent", values, {
        headers: { "Content-Type": "application/json" },
      }),
    onError: (error) => {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.status?.message || "Terjadi kesalahan."
          : "Gagal menambahkan Orangtua."
      );
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menambahkan Orangtua");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createParent.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="parent_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Orangtua</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. HP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="student_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anak</FormLabel>
              <FormControl>
                <MultiSelect
                  options={studentOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={createParent.isPending} type="submit">
          {createParent.isPending ? "Menambahkan..." : "Tambah Orangtua"}
        </Button>
      </form>
    </Form>
  );
}
