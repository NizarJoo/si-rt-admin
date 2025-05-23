import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditYear from "./edit-form";
import DeleteYear from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const getColumns = (onDataChange) => [
  {
    accessorKey: "academic_year",
    header: "Tahun Akademik",
    accessorFn: (row) => `${row.year_start} / ${row.year_end}`,
    cell: ({ row }) => {
      const { year_start, year_end } = row.original;
      return (
        <span className="font-medium">
          {year_start} / {year_end}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const YearId = row.original.id;
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
                <DialogTitle>Edit Tahun Akademik</DialogTitle>
              </DialogHeader>
              <EditYear id={YearId} currentValue={currentValue} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteYear id={YearId} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
