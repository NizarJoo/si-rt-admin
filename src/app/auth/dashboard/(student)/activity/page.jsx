"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { DataTable } from "./_component/data-table";
import { columns } from "./_component/columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const EventPage = () => {
  const authAxios = useAuthAxios();
  const events = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await authAxios.get("/school-event");
      return response.data;
    },
  });

  if (events.isFetching) {
    return <Loader2 className="animate-spin" />;
  }

  if (events.isError) {
    toast.error(
      isAxiosError(events.error)
        ? events.error.response?.data?.status?.message
        : events.error.message
    );
  }

  return (
    <section className="space-y-3">
      <h1>Semua Kegiatan</h1>
      <DataTable data={events.data?.data ?? []} columns={columns} />
    </section>
  );
};

export default EventPage;
