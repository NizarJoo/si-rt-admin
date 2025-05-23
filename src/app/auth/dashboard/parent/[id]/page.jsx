'use client';

import React, { use } from "react";
import useAuthAxios from "@/hooks/use-auth-axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import EditParent from "./_component/edit-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const EditParentPage = ({ params }) => {
  const { id } = use(params); 
  const authAxios = useAuthAxios();

  const parentDetail = useQuery({
    queryKey: ["parent-edit", id],
    queryFn: async () => {
      const res = await authAxios.get(`/auth/dashboard/parent/${id}`);
      return res.data;
    },
  });

  if (parentDetail.isLoading) {
    return <p>Loading...</p>;
  }

  if (parentDetail.isError) {
    toast.error(
      isAxiosError(parentDetail.error)
        ? parentDetail.error.response?.data?.status?.message || "Gagal memuat data"
        : parentDetail.error.message
    );
    return <p>Terjadi kesalahan saat memuat data guru</p>;
  }

  const parentData = parentDetail.data.data;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href="/auth/dashboard/parent"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="font-bold">
          Edit {parentData?.parent_name}
        </h1>
      </div>

      {parentData && (
        <EditParent id={id} currentValue={parentData} />
      )}
    </div>
  );
};

export default EditParentPage;
