'use client';

import React, { use } from "react";
import useAuthAxios from "@/hooks/use-auth-axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import EditTeacher from "./_component/edit-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const EditTeacherPage = ({ params }) => {
  const { id } = use(params); 
  const authAxios = useAuthAxios();

  const teacherDetail = useQuery({
    queryKey: ["teacher-edit", id],
    queryFn: async () => {
      const res = await authAxios.get(`/auth/dashboard/teacher-profil/${id}`);
      return res.data;
    },
  });

  if (teacherDetail.isLoading) {
    return <p>Loading...</p>;
  }

  if (teacherDetail.isError) {
    toast.error(
      isAxiosError(teacherDetail.error)
        ? teacherDetail.error.response?.data?.status?.message || "Gagal memuat data"
        : teacherDetail.error.message
    );
    return <p>Terjadi kesalahan saat memuat data guru</p>;
  }

  const teacherData = teacherDetail.data;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href="/auth/dashboard/teacher-profil"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="font-bold">
          Edit {teacherData?.teacher_name}
        </h1>
      </div>

      {teacherData && (
        <EditTeacher id={id} currentValue={teacherData} />
      )}
    </div>
  );
};

export default EditTeacherPage;
