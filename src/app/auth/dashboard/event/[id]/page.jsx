"use client";

import useAuthAxios from "@/hooks/use-auth-axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import React, {use} from "react";
import { toast } from "sonner";
import EditEvent from "./_component/edit-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const EditEventPage = ({ params }) => {
  const { id } = use(params);
  const authAxios = useAuthAxios();

  const eventDetail = useQuery({
    queryKey: ["event-edit", id],
    queryFn: async () => {
      const res = await authAxios.get(`/auth/dashboard/event/${id}`);
      return res.data;
    },
  });


  if (eventDetail.isError) {
    return <p>Loading...</p>;
  }
  if (eventDetail.isError) {
    toast.error(
      isAxiosError(eventDetail.error)
        ? eventDetail.error.response?.data?.status?.message || "Gagal memuat data"
        : eventDetail.error.message
    );
    return <p>Terjadi kesalahan saat memuat data guru</p>;
  }

  return eventDetail.data ? (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Link
          href="/auth/dashboard/event"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronLeft />
        </Link>
        <h1 className="font-bold">Edit {eventDetail.data?.event_name}</h1>
      </div>
      {eventDetail.data && (
      <EditEvent id={id} currentValue={eventDetail.data} />
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EditEventPage;
