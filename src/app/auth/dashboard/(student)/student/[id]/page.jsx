"use client";

import useAuthAxios from "@/hooks/use-auth-axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import React, { use } from "react";
import { toast } from "sonner";
import EditStudent from "./_component/edit-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const EditStudentPage = ({ params }) => {
  const { id } = use(params);
  const authAxios = useAuthAxios();

  const studentDetail = useQuery({
    queryKey: ["student-edit", id],
    queryFn: async () => {
      const res = await authAxios.get(`/auth/dashboard/student/${id}`);
        console.log("response:", res);

      return res.data;
    },
  });

  if (studentDetail.isLoading) {
    return <p>Loading...</p>;
  }

  if (studentDetail.isError) {
    toast.error(
        console.log("ERROR DARI SERVER:", error),

      isAxiosError(studentDetail.error)
        ? studentDetail.error.response?.data?.status?.message || "Gagal memuat data"
        : studentDetail.error.message
    );
    return <p>Terjadi kesalahan saat memuat data siswa</p>;
  }

  return studentDetail.data ? (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href="/auth/dashboard/student"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="font-bold">Edit {studentDetail.data?.student_name}</h1>
      </div>
      <EditStudent id={id} currentValue={studentDetail.data?.data} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EditStudentPage;
