import { Edit2, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteTeacherForm from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const getColumns = (onDataChange) => [
  {
    accessorKey: "teacher_name",
    header: "Nama",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("teacher_name") || "-"}</span>
    ),
  },
  {
    accessorKey: "id_number",
    header: "NIP",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id_number") || "-"}</span>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "No. Telepon",
    cell: ({ row }) => {
      const value = row.getValue("phone_number");
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
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const value = row.getValue("gender");
      return value === "male"
        ? "Laki-laki"
        : value === "female"
        ? "Perempuan"
        : "-";
    },
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const teacherId = row.original.id;
      return (
        <div className="flex gap-1">
          <Link
            className={buttonVariants({ size: "icon" })}
            href={`/auth/dashboard/teacher-profil/${teacherId}`}
          >
            <Edit2 />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteTeacherForm id={teacherId} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
