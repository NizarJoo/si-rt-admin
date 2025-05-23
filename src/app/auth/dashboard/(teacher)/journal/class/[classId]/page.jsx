"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const JournalPage = () => {
  const authAxios = useAuthAxios();
  const { classId } = useParams();

  console.log("classId:", classId);
  console.log("axios headers:", authAxios.defaults.headers);

  const journals = useQuery({
    queryKey: ["journal-list", classId],
    queryFn: async () => {
      const url = `/auth/dashboard/journal/classes/${classId}`;
      console.log("fetching URL:", url);
      const response = await authAxios.get(url);
      return response.data;
    },
  });

  if (journals.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  if (journals.isError) {
    toast.error(
      isAxiosError(journals.error)
        ? journals.error.response?.data?.status?.message ||
            "Data tidak ditemukan"
        : journals.error.message
    );
  }

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Semua Jurnal</h1>
      <DataTable data={journals.data?.data ?? []} getColumns={getColumns} />
    </section>
  );
};

export default JournalPage;
