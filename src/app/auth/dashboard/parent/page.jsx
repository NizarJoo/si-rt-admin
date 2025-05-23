"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const ParentPage = () => {
  const authAxios = useAuthAxios();
  const parents = useQuery({
    queryKey: ["parent-list"],
    queryFn: async () => {
      const response = await authAxios.get("/auth/dashboard/parent");
      return response.data;
    },
  });

  if (parents.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  if (parents.isError) {
    const errorMsg = isAxiosError(parents.error)
      ? parents.error.response?.data?.status?.message || "Data tidak ditemukan"
      : parents.error.message;
    toast.error(errorMsg);
  }
  

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Semua Data Orangtua</h1>
      <DataTable data={parents.data?.data ?? []} getColumns={getColumns} />
    </section>
  );
};

export default ParentPage;
