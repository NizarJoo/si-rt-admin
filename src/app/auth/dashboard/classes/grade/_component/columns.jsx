import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditGrade from "./edit-form";
import DeleteGrade from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const getColumns = (onDataChange) => [
  {
    accessorKey: "grade_name",
    header: "Nama Kelas",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("grade_name") || "-"}</span>
    ),
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const GradeId = row.original.id;
      const currentValue = row.original;

      return (
        <div className="flex gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon">
                <Edit2 />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Kelas</DialogTitle>
              </DialogHeader>
              <EditGrade id={GradeId} currentValue={currentValue} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteGrade id={GradeId} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
