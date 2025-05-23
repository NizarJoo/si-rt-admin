"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import useAuthAxios from "@/hooks/use-auth-axios";
import { DataTable } from "./_component/data-table";
import { getColumns } from "./_component/columns";
import { useParams } from "next/navigation";

// Helper aman untuk format tanggal
const safeFormat = (date) => {
  return date instanceof Date && !isNaN(date)
    ? format(date, "yyyy-MM-dd")
    : null;
};

const StudentAttendancePage = () => {
  const authAxios = useAuthAxios();
  const {classId} = useParams();

  const [viewMode, setViewMode] = useState("daily"); // 'daily' | 'range'
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: undefined,
  });

  // Ambil data presensi guru (harian atau range)
  const fetchStudentAttendance = useCallback(async () => {
    const start = safeFormat(dateRange.startDate);
    const end = safeFormat(dateRange.endDate);

    if (!start || (viewMode === "range" && !end)) return [];

    try {
      const endpoint =
        viewMode === "daily"
          ? `/auth/dashboard/student-attendance/${classId}/by-date?date=${start}`
          : `/auth/dashboard/student-attendance/rekap?start=${start}&end=${end}&grade=${classId}`;

      const res = await authAxios.get(endpoint);
      return res.data;
    } catch (error) {
      throw error; 
    }
  }, [authAxios, dateRange, viewMode]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["student-attendance-list", viewMode, dateRange, classId],
    queryFn: fetchStudentAttendance,
    enabled:
      !!dateRange.startDate && (viewMode === "daily" || !!dateRange.endDate),
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.status?.message || "Data tidak ditemukan"
        : error.message;
      toast.error(message);
    },
  });

  // Handle perubahan mode harian <-> rentang
  const handleChangeViewMode = (e) => {
    setViewMode(e.target.value);
    setDateRange({
      startDate: new Date(),
      endDate: undefined,
    });
  };

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Presensi Siswa</h1>

      {/* Filter mode harian / rentang */}
      <div className="flex gap-2 items-center">
        <label className="text-sm">Lihat berdasarkan:</label>
        <select
          value={viewMode}
          onChange={handleChangeViewMode}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="daily">Harian</option>
          <option value="range">Rentang Tanggal</option>
        </select>
      </div>

      {/* Loader / Table */}
      {isFetching ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : (
        <DataTable
          data={Array.isArray(data?.data) ? data.data : []}
          getColumns={getColumns}
          dateRange={dateRange}
          setDateRange={setDateRange}
          viewMode={viewMode}
          refetch={refetch}
        />
      )}
    </section>
  );
};

export default StudentAttendancePage;
