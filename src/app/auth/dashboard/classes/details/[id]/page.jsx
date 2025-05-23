"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft } from "lucide-react";
import React, { useEffect } from "react";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

const API_URL = "https://si-erte-production.up.railway.app";

const DetailsPage = () => {
  const { id } = useParams();
  const authAxios = useAuthAxios();
  const details = useQuery({
    queryKey: ["student-class-list", id],
    queryFn: async () => {
      const response = await authAxios.get(
        `auth/dashboard/classes/details/${id}`
      );
      return response.data;
    },
  });

  const classDetail = useQuery({
    queryKey: ["class-detail", id],
    queryFn: async () => {
      const response = await authAxios.get(`auth/dashboard/classes/${id}`);
      return response.data.data;
    },
  });
  

  useEffect(() => {
    if (classDetail.isError || details.isError) {
      toast.error(
        isAxiosError(classDetail.isError || details.error)
          ? details.error.response?.data?.status?.message ||
              "Data tidak ditemukan"
          : details.error.message
      );
    }
  }, [
    details.isError,
    details.error,
    classDetail.isError,
    classDetail.isError,
  ]);

  if (classDetail.isFetching || details.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href="/auth/dashboard/classes"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="text-xl font-bold">
          Data Semua Siswa {classDetail.data.grade_name}
        </h1>
      </div>
      <DataTable data={details.data?.data ?? []} getColumns={getColumns} />
    </div>
  );
};

export default DetailsPage;
