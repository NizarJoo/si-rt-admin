import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteParentForm from "./delete-form"; // pastikan file ini ada & sesuai

export const getColumns = (onDataChange) => [
  {
    accessorKey: "parent_name",
    header: "Nama",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("parent_name") || "-"}</span>
    ),
  },
  {
    accessorKey: "address",
    header: "Alamat",
    cell: ({ row }) => {
      const fullText = row.getValue("address");

      if (!fullText) return <span className="text-muted-foreground">-</span>;

      const preview =
        fullText.length > 20 ? fullText.slice(0, 20) + "..." : fullText;

      return <span title={fullText}>{preview}</span>;
    },
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
    accessorKey: "student",
    header: "Anak",
    cell: ({ row }) => {
      const students = row.original.student || [];
      return (
        <div className="flex flex-wrap gap-1">
          {students.length === 0 ? (
            <span className="text-muted-foreground italic">Tidak ada</span>
          ) : (
            students.map((s, idx) => (
              <span
                key={s.id || `${s.name}-${idx}`}
                className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {s.name}
              </span>
            ))
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const parentId = row.original.id;
      return (
        <div className="flex gap-1">
          <Link
            className={buttonVariants({ size: "icon" })}
            href={`/auth/dashboard/parent/${parentId}`}
          >
            <Edit2 />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteParentForm id={parentId} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
