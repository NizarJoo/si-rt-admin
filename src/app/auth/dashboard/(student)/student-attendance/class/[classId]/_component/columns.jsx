import { Edit2, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditstudentAttendance from "./edit-form";

export const getColumns = (dateRange, onDataChange) => {
  const selectedDate = dateRange?.startDate;
  return [
    {
      accessorKey: "student_name",
      header: "Nama Siswa",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("student_name") || "-"}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date")).toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          } || "-"
        );
        return <span>{date}</span>;
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
              <EditstudentAttendance
                gytsId={row.original.gyts_id}
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
};
