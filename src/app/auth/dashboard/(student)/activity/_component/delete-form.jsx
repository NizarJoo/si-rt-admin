import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-hot-toast";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import useAuthAxios from "@/hooks/use-auth-axios"; // Pastikan ini ada

const DeleteEventForm = ({ id, callback }) => {
  const authAxios = useAuthAxios();

  const deleteUser = useMutation({
    mutationKey: ["delete-user", id], // Supaya lebih spesifik
    mutationFn: async () => {
      return await authAxios.delete(`/users/${id}`); // Perbaikan endpoint
    },
    onError: (error) => {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.status?.message || "Terjadi kesalahan"
          : error.message
      );
    },
    onSuccess: () => {
      callback(); // Memperbarui tabel setelah data dihapus
      toast.success("Berhasil menghapus data");
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
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

export default DeleteEventForm;
