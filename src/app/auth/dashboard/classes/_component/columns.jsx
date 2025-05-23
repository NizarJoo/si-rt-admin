import { Edit2, Trash2, Info } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditClass from "./edit-form";
import DeleteClass from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
    header: "Aksi",
    cell: ({ row }) => {
      const classId = row.original.id;
      const currentValue = row.original;

      return (
        <div className="flex gap-1">
          <Link
            className={buttonVariants({ size: "icon" })}
            href={`/auth/dashboard/classes/details/${classId}`}
          >
            <Info />
          </Link>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon">
                <Edit2 />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Tahun Akademik</DialogTitle>
              </DialogHeader>
              <EditClass id={classId} currentValue={currentValue} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteClass id={classId} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
