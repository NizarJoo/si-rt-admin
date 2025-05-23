"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const StudentPage = () => {
  const authAxios = useAuthAxios();
  const students = useQuery({
    queryKey: ["student-list"],
    queryFn: async () => {
      const response = await authAxios.get("/auth/dashboard/student");
      return response.data;
    },
  });

  if (students.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  if (students.isError) {
    toast.error(
      isAxiosError(students.error)
        ? students.error.response?.data?.status?.message
        : students.error.message
    );
  }

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Semua Data Siswa</h1>
      <DataTable data={students.data?.data ?? []} getColumns={getColumns} />
    </section>
  );
};

export default StudentPage;
