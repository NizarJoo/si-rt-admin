"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft } from "lucide-react";
import React from "react";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const GradePage = () => {
  const authAxios = useAuthAxios();
  const grade = useQuery({
    queryKey: ["grade-list"],
    queryFn: async () => {
      const response = await authAxios.get("/auth/dashboard/classes/grade");
      return response.data;
    },
  });

  if (grade.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  if (grade.isError) {
    const errorMsg = isAxiosError(grade.error)
      ? grade.error.response?.data?.status?.message || "Data tidak ditemukan"
      : grade.error.message;
    toast.error(errorMsg);
  }
  

  return (
    <section className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href="/auth/dashboard/classes"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="text-2xl font-semibold">Semua Data Kelas</h1>{" "}
      </div>{" "}
      <DataTable data={grade.data?.data ?? []} getColumns={getColumns} />
    </section>
  );
};

export default GradePage;
