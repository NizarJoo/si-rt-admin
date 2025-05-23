"use client";

import useAuthAxios from "@/hooks/use-auth-axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import EditJournal from "./_component/edit-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const EditJournalPage = () => {
  const { journalId, classId } = useParams();
  const authAxios = useAuthAxios();
  const router = useRouter();

  const journalDetail = useQuery({
    queryKey: ["journal-edit", journalId],
    queryFn: async () => {
      const res = await authAxios.get(
        `/auth/dashboard/journal/classes/${classId}/${journalId}`
      );
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (journalDetail.isError) {
      toast.error(
        isAxiosError(journalDetail.error)
          ? journalDetail.error.response?.data?.status?.message ||
              "Gagal memuat data jurnal"
          : journalDetail.error.message
      );
    }
  }, [journalDetail.isError]);

  if (journalDetail.isLoading) {
    return <p>Loading...</p>;
  }

  if (journalDetail.isError) {
    return <p>Gagal memuat data jurnal.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href={`/auth/dashboard/journal/class/${classId}`}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="font-bold">
          Edit Jurnal: {journalDetail.data.jurnal.mata_pelajaran}
        </h1>
      </div>

      <EditJournal
        currentValue={journalDetail.data.jurnal}
        classId={classId}
        callback={() => router.push(`/auth/dashboard/journal/class/${classId}`)}
      />
    </div>
  );
};

export default EditJournalPage;
