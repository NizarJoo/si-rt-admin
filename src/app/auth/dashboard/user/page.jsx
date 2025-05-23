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

const UserPage = () => {
  const authAxios = useAuthAxios();
  const user = useQuery({
    queryKey: ["user-list"],
    queryFn: async () => {
      const response = await authAxios.get("/auth/dashboard/user");
      return response.data;
    },
  });

  if (user.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  if (user.isError) {
    const errorMsg = isAxiosError(user.error)
      ? user.error.response?.data?.status?.message || "Data tidak ditemukan"
      : user.error.message;
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
        <h1 className="text-2xl font-semibold">Semua Data Pengguna</h1>{" "}
      </div>{" "}
      <DataTable data={user.data?.data ?? []} getColumns={getColumns} />
    </section>
  );
};

export default UserPage;
