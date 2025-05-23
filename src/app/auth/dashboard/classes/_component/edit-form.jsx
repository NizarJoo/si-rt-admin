"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import useAuthAxios from "@/hooks/use-auth-axios";
import Select from "react-select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  grade: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Kelas harus dipilih" }
  ),
  academic_year: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Tahun akademik harus dipilih" }
  ),
  teacher: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Wali kelas harus dipilih" }
  ),
});

export default function EditClass({ currentValue, callback }) {
  const authAxios = useAuthAxios();
  const [grades, setGrades] = useState([]);
  const [years, setYears] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const fetchOptions = async () => {
    try {
      const [gradeRes, yearRes, teacherRes] = await Promise.all([
        authAxios.get("/auth/dashboard/classes/grade"),
        authAxios.get("/auth/dashboard/classes/academic-year"),
        authAxios.get("/auth/dashboard/teacher-profil"),
      ]);

      setGrades(
        (gradeRes.data.data || []).map((item) => ({
          value: item.id,
          label: item.grade_name,
        }))
      );

      setYears(
        (yearRes.data.data || []).map((item) => ({
          value: item.id,
          label: `${item.year_start} / ${item.year_end}`,
        }))
      );

      setTeachers(
        (teacherRes.data || []).map((item) => ({
          value: item.id,
          label: item.teacher_name,
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

  useEffect(() => {
    if (currentValue) {
      const selectedTeacher = teachers.find(
        (t) => t.value === currentValue.teacher.id
      );

      reset({
        grade: {
          value: currentValue.grade.id,
          label: currentValue.grade.grade_name,
        },
        academic_year: {
          value: currentValue.academic_year.id,
          label: `${currentValue.academic_year.year_start} / ${currentValue.academic_year.year_end}`,
        },
        teacher: selectedTeacher || null,
      });
    }
  }, [currentValue, reset, teachers]);

  const mutation = useMutation({
    mutationKey: ["class-edit"],
    mutationFn: (data) =>
      authAxios.put(`/auth/dashboard/classes/${currentValue.id}`, {
        grade_id: data.grade.value,
        academic_year_id: data.academic_year.value,
        teacher_id: data.teacher.value,
      }),
    onSuccess: () => {
      toast.success("Kelas berhasil diperbarui");
      if (typeof callback === "function") callback(); 
    },
    onError: () => {
      toast.error("Gagal memperbarui kelas");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nama Kelas */}
      <div>
        <label className="block mb-1 font-medium">Nama Kelas</label>
        <Controller
          name="grade"
          control={control}
          render={({ field }) => (
            <Select {...field} options={grades} placeholder="Pilih kelas..." />
          )}
        />
        {errors.grade && (
          <p className="text-sm text-red-500">{errors.grade.message}</p>
        )}
      </div>

      {/* Tahun Akademik */}
      <div>
        <label className="block mb-1 font-medium">Tahun Akademik</label>
        <Controller
          name="academic_year"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={years}
              placeholder="Pilih tahun akademik..."
            />
          )}
        />
        {errors.academic_year && (
          <p className="text-sm text-red-500">{errors.academic_year.message}</p>
        )}
      </div>

      {/* Wali Kelas */}
      <div>
        <label className="block mb-1 font-medium">Wali Kelas</label>
        <Controller
          name="teacher"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={teachers}
              placeholder="Pilih wali kelas..."
            />
          )}
        />
        {errors.teacher && (
          <p className="text-sm text-red-500">{errors.teacher.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Simpan
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  );
}
