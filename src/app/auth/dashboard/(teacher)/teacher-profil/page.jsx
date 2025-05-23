"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const TeacherPage = () => {
  const authAxios = useAuthAxios();
  const teachers = useQuery({
    queryKey: ["teacher-list"],
    queryFn: async () => {
      const response = await authAxios.get("/auth/dashboard/teacher-profil");
      return response.data;
    },
  });

  if (teachers.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  if (teachers.isError) {
    toast.error(
      isAxiosError(teachers.error)
        ? teachers.error.response?.data?.status?.message || "Data tidak ditemukan"
        : teachers.error.message
    );
  }
  

  return (
    <section className="space-y-3">
      <h1 className= "font-semibold">Semua Data Guru</h1>
      <DataTable data={teachers.data?.data ?? []} getColumns={getColumns} />
    </section>
  );
};

export default TeacherPage;
