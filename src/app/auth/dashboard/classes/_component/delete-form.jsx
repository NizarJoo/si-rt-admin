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

const DeleteClass = ({ id, callback }) => {
  const authAxios = useAuthAxios();

  const deleteClass = useMutation({
    mutationKey: ["class-delete", id],
    mutationFn: async () => {
      return await authAxios.delete(`/auth/dashboard/classes/${id}`);
    },
    onError: () => {
      toast.error("Gagal menghapus kelas");
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menghapus data.");
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
        <AlertDialogDescription>
          Tindakan ini tidak dapat dibatalkan. Data akan terhapus secara
          permanen.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={deleteClass.isPending}>
          Batal
        </AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: "destructive" })}
          disabled={deleteClass.isPending}
          onClick={() => deleteClass.mutate()}
        >
          {deleteClass.isPending ? "Menghapus..." : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteClass;
