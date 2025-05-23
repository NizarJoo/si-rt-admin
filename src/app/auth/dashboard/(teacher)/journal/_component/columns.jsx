import { Info } from "lucide-react";
import {  buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const getColumns = (onDataChange) => [
  {
    accessorFn: (row) => row.grade?.grade_name,
    id: "grade_name",
    header: "Nama Kelas",
    cell: (info) => (
      <span className="font-medium">{info.getValue() || "-"}</span>
    ),
  },
  {
    accessorFn: (row) =>
      row.academic_year
        ? `${row.academic_year.year_start}/${row.academic_year.year_end}`
        : "",
    id: "academic_year",
    header: "Tahun Akademik",
    cell: (info) => (
      <span className="font-medium">{info.getValue() || "-"}</span>
    ),
  },
  {
    accessorFn: (row) => row.teacher?.name,
    id: "teacher_name",
    header: "Wali Kelas",
    cell: (info) => (
      <span className="font-medium">{info.getValue() || "-"}</span>
    ),
  },
  {
    id: "actions",
    header: "Lihat Jurnal",
    cell: ({ row }) => {
      const classId = row.original.id;

      return (
        <div className="flex gap-1">
          <Link
            className={buttonVariants({ size: "icon" })}
            href={`/auth/dashboard/journal/class/${classId}`}
          >
            <Info />
          </Link>
        </div>
      );
    },
  },
];
