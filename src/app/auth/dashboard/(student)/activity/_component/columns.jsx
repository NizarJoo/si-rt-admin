import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteUserForm from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "idnumber",
    header: "NIS",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("idnumber")}</span>
    ),
  },
  {
    accessorKey: "activityDate",
    header: "Tanggal Aktivitas",
    cell: ({ row }) => {
      const activityDate = new Date(row.getValue("activityDate")).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return <span>{activityDate}</span>;
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt")).toLocaleString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );
      return <span>{createdAt}</span>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <Link
          className={buttonVariants({ size: "icon" })}
          href={`/dashboard/user/${row.getValue("id")}`}
        >
          <Edit2 />
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="destructive">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <DeleteUserForm id={row.getValue("id")} callback={() => {}} />
        </AlertDialog>
      </div>
    ),
  },
];
