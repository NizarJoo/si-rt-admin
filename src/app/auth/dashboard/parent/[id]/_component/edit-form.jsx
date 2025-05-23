"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import useAuthAxios from "@/hooks/use-auth-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const formSchema = z.object({
  parent_name: z.string().min(3, "Nama harus diisi"),
  address: z.string().min(3, "Alamat harus diisi"),
  phone_number: z.string().min(10, "Nomor HP minimal 10 digit"),
});

export default function EditParentForm({ currentValue, id }) {
  const authAxios = useAuthAxios();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parent_name: currentValue.parent_name ?? "",
      address: currentValue.address ?? "",
      phone_number: currentValue.phone_number ?? "",
    },
  });

const queryClient = useQueryClient();
  const editParent = useMutation({
    mutationKey: ["parent-edit", id],
    mutationFn: async (values) =>
      await authAxios.put(`/auth/dashboard/parent/${id}`, values, {
        headers: { "Content-Type": "application/json" },
      }),
    onError: (error) => {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.status?.message || "Terjadi kesalahan."
          : "Gagal memperbarui data orangtua."
      );
    },
    onSuccess: () => {
      toast.success("Berhasil memperbarui data orangtua");
            queryClient.refetchQueries({ queryKey: ["parent-list"] });

    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => editParent.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="parent_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Orangtua</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. HP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={editParent.isPending} type="submit">
          {editParent.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}
