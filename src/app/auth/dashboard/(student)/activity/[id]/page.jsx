"use client";

import useAuthAxios from "@/hooks/use-auth-axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import EditEvent from "./_component/edit-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const EditEventPage = ({ params }) => {
  const { id } = params;
  const authAxios = useAuthAxios();

  const eventDetail = useQuery({
    queryKey: ["event-detail", id],
    queryFn: async () => await authAxios.get(`/kegiatan/${id}`),
  });

  if (eventDetail.isError) {
    toast.error(
      isAxiosError(eventDetail.error)
        ? eventDetail.error.response?.data["status"]["message"]
        : eventDetail.error.message
    );
  }

  return eventDetail.data ? (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href="/dashboard/school-event"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="font-bold">
          Edit {eventDetail.data?.data.nama_kegiatan}
        </h1>
      </div>
      <EditEvent id={id} currentValue={eventDetail.data?.data} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EditEventPage;
