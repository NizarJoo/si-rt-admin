import { Edit2, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditTeacherAttendance from "./edit-form";

export const getColumns = (dateRange, onDataChange) => {
  const selectedDate = dateRange?.startDate;
  return [
  {
    accessorKey: "teacher_name",
    header: "Nama Guru",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("teacher_name") || "-"}</span>
    ),
  },
  {
    accessorKey: "time",
    header: "Waktu Presensi",
    cell: ({ row }) => {
      const time = row.getValue("time");
      if (!time || time === "NULL") {
        return <span>-</span>;
      }

      const clock = new Date(time).toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return <span>{clock}</span>;
    },
  },

  {
    accessorKey: "status",
    header: "Keterangan",
    cell: ({ row }) => {
      const value = row.getValue("status");
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
      const data = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon">
              <Edit2 />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Status Presensi</DialogTitle>
            </DialogHeader>
            <EditTeacherAttendance
              teacherId={row.original.teacher_id}
              currentValue={data}
              dateValue={selectedDate}
              onDataChange={onDataChange}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
}
