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

const DeleteStudentClass = ({ id, callback }) => {
  const authAxios = useAuthAxios();

  const deleteStudentClass = useMutation({
    mutationKey: ["student-class-delete", id],
    mutationFn: async () => {
      return await authAxios.delete(`/auth/dashboard/classes/details/${id}`);
    },
    onError: () => {
      toast.error("Gagal menghapus siswa");
    },
    onSuccess: () => {
      callback();
      toast.success("Berhasil menghapus siswa.");
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
        <AlertDialogCancel disabled={deleteStudentClass.isPending}>
          Batal
        </AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: "destructive" })}
          disabled={deleteStudentClass.isPending}
          onClick={() => deleteStudentClass.mutate()}
        >
          {deleteStudentClass.isPending ? "Menghapus..." : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteStudentClass;
