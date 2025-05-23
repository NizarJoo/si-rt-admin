import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import useAuthAxios from "@/hooks/use-auth-axios";

const DeleteJournal = ({ classId, journalId, callback }) => {
  const authAxios = useAuthAxios();

  const deleteJournal = useMutation({
    mutationKey: ["journal-delete"],
    mutationFn: async ({ classId, journalId }) => {
      return await authAxios.delete(
        `/auth/dashboard/journal/classes/${classId}/${journalId}`
      );
    },
    onError: () => {
      toast.error("Gagal menghapus jurnal");
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menghapus jurnal.");
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Yakin ingin menghapus jurnal?</AlertDialogTitle>
        <AlertDialogDescription>
          Tindakan ini tidak dapat dibatalkan. Data jurnal akan dihapus secara
          permanen.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={deleteJournal.isPending}>
          Batal
        </AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: "destructive" })}
          disabled={deleteJournal.isPending}
          onClick={() => deleteJournal.mutate({ classId, journalId })}
        >
          {deleteJournal.isPending ? "Menghapus..." : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteJournal;
