import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import useAuthAxios from "@/hooks/use-auth-axios"; // Pastikan ini ada

const DeleteStudentForm = ({ id, callback }) => {
  const authAxios = useAuthAxios();

  const deleteStudent = useMutation({
    mutationKey: ["student-delete", id],
    mutationFn: async () => {
      return await authAxios.delete(`/auth/dashboard/student/${id}`);
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
        <AlertDialogCancel disabled={deleteStudent.isPending}>
          Batal
        </AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: "destructive" })}
          disabled={deleteStudent.isPending}
          onClick={() => deleteStudent.mutate()}
        >
          {deleteStudent.isPending ? "Menghapus..." : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteStudentForm;
