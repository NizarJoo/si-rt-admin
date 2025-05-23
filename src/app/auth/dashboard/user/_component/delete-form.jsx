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

const DeleteUser = ({ id, callback }) => {
  const authAxios = useAuthAxios();

  const deleteUser = useMutation({
    mutationKey: ["user-delete", id],
    mutationFn: async () => {
      return await authAxios.delete(`/auth/dashboard/user/${id}`);
    },
    onError: () => {
      toast.error("Gagal menghapus data, kelas sedang digunakan");
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
        <AlertDialogCancel disabled={deleteUser.isPending}>
          Batal
        </AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: "destructive" })}
          disabled={deleteUser.isPending}
          onClick={() => deleteUser.mutate()}
        >
          {deleteUser.isPending ? "Menghapus..." : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteUser;
