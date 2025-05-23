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

const DeleteTeacherForm = ({ id, callback }) => {
  const authAxios = useAuthAxios();

  const deleteTeacher = useMutation({
    mutationKey: ["teacher-delete", id],
    mutationFn: async () => {
      return await authAxios.delete(`/auth/dashboard/teacher-profil/${id}`);
    },
    onError: () => {
      toast.error("Gagal menghapus data.");
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
        <AlertDialogCancel disabled={deleteTeacher.isPending}>
          Batal
        </AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: "destructive" })}
          disabled={deleteTeacher.isPending}
          onClick={() => deleteTeacher.mutate()}
        >
          {deleteTeacher.isPending ? "Menghapus..." : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteTeacherForm;
