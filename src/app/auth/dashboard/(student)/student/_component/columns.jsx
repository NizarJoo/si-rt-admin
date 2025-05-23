import { Edit2, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteStudentForm from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const getColumns = (onDataChange) => [
  {
    accessorKey: "student_name",
    header: "Nama Siswa",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("student_name") || "-"}</span>
    ),
  },
  {
    accessorKey: "nis",
    header: "Nomer Induk Siswa",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nis") || "-"}</span>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "No. Telepon",
    cell: ({ row }) => {
      const value = row.getValue("phone_number");
      if (!value || value === "NULL" || value === null || value === "") {
        return "-";
      }
      return value;
    },
  },
  {
    accessorKey: "parent_name",
    header: "Orangtua",
    cell: ({ row }) => {
      const parentName = row.getValue("parent_name");
      return parentName ? (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {parentName}
        </span>
      ) : (
        <span className="text-muted-foreground italic">Tidak ada</span>
      );
    },
  },
  {
    accessorKey: "grade_name",
    header: "Kelas",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("grade_name") || "-"}</span>
    ),
  },
  {
    id: "tahun",
    header: "Tahun",
    cell: ({ row }) => {
      const start = row.original.year_start;
      const end = row.original.year_end;
      return start && end ? `${start} / ${end}` : "-";
    },
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const studentId = row.original.id;
      return (
        <div className="flex gap-1">
          <Link
            className={buttonVariants({ size: "icon" })}
            href={`/auth/dashboard/student/${studentId}`}
          >
            <Edit2 />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteStudentForm id={studentId} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
