import { Edit2, Trash2 } from "lucide-react";
import { buttonVariants, Button} from "@/components/ui/button";
import Link from "next/link";
// import { dateFormat } from "@/lib/utils"; 
import DeleteJournal from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export const getColumns = (classId, onDataChange) => [
  {
    accessorKey: "mata_pelajaran",
    header: "Mata Pelajaran",
    cell: (row) => (
      <span className="font-medium">
        {row.getValue("mata_pelajaran") || "-"}
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
    accessorKey: "time_start",
    header: "Jam Mulai",
    cell: (row) => <span>{row.getValue("time_start")}</span>,
  },
  {
    accessorKey: "time_end",
    header: "Jam Selesai",
    cell: (row) => <span>{row.getValue("time_end")}</span>,
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      const fullText = row.getValue("description");

      if (!fullText) return <span className="text-muted-foreground">-</span>;

      const preview =
        fullText.length > 30 ? fullText.slice(0, 30) + "..." : fullText;

      return <span title={fullText}>{preview}</span>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const journalId = row.original.id;

      return (
        <div className="flex gap-1">
          <Link
            className={buttonVariants({ size: "icon" })}
            href={`/auth/dashboard/journal/class/${classId}/${journalId}`}
          >
            <Edit2 />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteJournal
              classId={classId}
              journalId={journalId}
              callback={onDataChange}
            />
          </AlertDialog>
        </div>
      );
    },
  },
];
