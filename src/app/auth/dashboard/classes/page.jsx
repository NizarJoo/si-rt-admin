"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const ClassPage = () => {
  const authAxios = useAuthAxios();

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["class-list"],
    queryFn: async () => {
      const response = await authAxios.get("/auth/dashboard/classes");
      return response.data;
    },
  });

  useEffect(() => {
    if (isError) {
      const errorMsg = isAxiosError(error)
        ? error.response?.data?.status?.message || "Data tidak ditemukan"
        : error.message;
      toast.error(errorMsg);
    }
  }, [isError, error]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Semua Data Kelas</h1>
      <DataTable data={data?.data ?? []} getColumns={getColumns} />
    </section>
  );
};

export default ClassPage;
