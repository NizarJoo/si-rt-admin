import Image from "next/image";
import { Edit2, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteEventForm from "./delete-form";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const getColumns = (onDataChange) => [
  {
    accessorKey: "event_name",
    header: "Nama Kegiatan",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("event_name") || "-"}</span>
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
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const imagePath = row.getValue("image");

      // Handle null, undefined, atau string kosong
      if (!imagePath) {
        return <span className="text-muted-foreground">-</span>;
      }

      // Kalau backend kasih path kayak "./uploads/..." atau "/uploads/..."
      const imageUrl = imagePath.startsWith("http")
        ? imagePath
        : `https://si-erte-production.up.railway.app/public/${imagePath.replace(
            /^\.?\/?/,
            "/"
          )}`;

      return (
        <div className="w-16 h-16 overflow-hidden rounded-md">
          <img
            src={imageUrl}
            alt="Gambar Kegiatan"
            className="object-cover w-full h-full"
          />
        </div>
      );
    },
  },

{
  accessorKey: "description",
  header: "Deskripsi",
  cell: ({ row }) => {
    const fullText = row.getValue("description");

    if (!fullText) return <span className="text-muted-foreground">-</span>;

    const preview = fullText.length > 30
      ? fullText.slice(0, 30) + "..."
      : fullText;

return <span title={fullText}>{preview}</span>;
  },
},
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const eventID = row.original.id;
      return (
        <div className="flex gap-1">
          <Link
            className={buttonVariants({ size: "icon" })}
            href={`/auth/dashboard/event/${eventID}`}
          >
            <Edit2 />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <DeleteEventForm id={eventID} callback={onDataChange} />
          </AlertDialog>
        </div>
      );
    },
  },
];
