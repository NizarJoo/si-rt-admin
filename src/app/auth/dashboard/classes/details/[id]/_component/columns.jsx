import { Edit2, Trash2, Info } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteStudentClass from "./delete-form";
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
    header: "NIS",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nis") || "-"}</span>
    ),
  },
  {
    accessorKey: "student_phone_number",
    header: "No. HP",
    cell: ({ row }) => {
      const value = row.getValue("student_phone_number");
      if (
        !value ||
        value === "NULL" ||
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "-";
      }
      return value;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const studentId = row.original.id;

      return (
        <div className="flex gap-1">

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteStudentClass id={studentId} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
