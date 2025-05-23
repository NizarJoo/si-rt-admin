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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { format } from "date-fns";
import { useParams } from "next/navigation";

// Status enum options
const attendance = [
  { value: "Hadir", label: "Hadir" },
  { value: "Izin", label: "Izin" },
  { value: "Sakit", label: "Sakit" },
  { value: "Alpha", label: "Alpha" },
];

// Zod schema
const formSchema = z.object({
  status: z.enum(["Hadir", "Izin", "Sakit", "Alpha"], {
    required_error: "Status wajib dipilih",
  }),
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
            <option value="">Pilih status</option>
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

export default function EditstudentAttendance({
  currentValue,
  gytsId,
  dateValue,
  onDataChange,
}) {
  const authAxios = useAuthAxios();
  const queryClient = useQueryClient();
  const {classId} = useParams();

  const dateString = dateValue.toLocaleDateString("en-CA");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { status: "" },
  });

  // Sync default value kalau currentValue berubah
  useEffect(() => {
    form.reset({ status: currentValue.status || "" });
  }, [currentValue, form]);

const editStudentAttendanceMutation = useMutation({
  mutationKey: ["student-attendance-edit", classId],
  mutationFn: async (values) => {
    const payload = {
      updates: [
        {
          gyts_id: gytsId,
          status: values.status,
        },
      ],
    };


    return await authAxios.put(
      `/auth/dashboard/student-attendance/${classId}/by-date?date=${dateString}`,
      payload
    );
  },
  

    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Terjadi kesalahan"
        : "Gagal mengirim data.";
      toast.error(message);
    },
    onSuccess: (res) => {
      const result = res.data;
      if (result.code === 200) {
        toast.success("Berhasil mengubah data presensi");
        queryClient.refetchQueries({
          queryKey: [
            "student-attendance-list",
            "daily",
            { startDate: dateValue },
            classId,
          ],
        });

        onDataChange();
      } else {
        toast.error(result.message || "Gagal mengubah presensi");
      }
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          editStudentAttendanceMutation.mutate(values)
        )}
        className="space-y-4"
      >
        <SelectField
          name="status"
          label="Keterangan"
          control={form.control}
          options={attendance}
        />

        <Button
          disabled={editStudentAttendanceMutation.isPending}
          type="submit"
        >
          {editStudentAttendanceMutation.isPending
            ? "Mengubah..."
            : "Simpan Perubahan"}
        </Button>
      </form>
    </Form>
  );
}
