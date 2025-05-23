"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import useAuthAxios from "@/hooks/use-auth-axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const imageTypes = ["image/jpeg", "image/png", "image/jpg"];

const formSchema = z.object({
  name: z.string().min(3, "Nama sekolah harus lebih dari 3 karakter"),
  head_master: z
    .string()
    .min(10, "Nama kepala sekolah harus lebih dari 10 karakter"),
  logo: z
    .any()
    .refine(
      (file) => file instanceof File || file === null,
      "File harus berupa gambar!"
    )
    .refine(
      (file) => !file || imageTypes.includes(file.type),
      "File harus berupa JPG atau PNG!"
    )
    .refine(
      (file) => !file || file.size < 1024 * 1024 * 2,
      "Ukuran file maksimal 2MB!"
    ),
  address: z.string().min(5, "Alamat harus lebih dari 5 karakter"),
});

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function SchoolForm() {
  const authAxios = useAuthAxios();
  const router = useRouter();
  const [preview, setPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      head_master: "",
      logo: null,
      address: "",
    },
  });

  useEffect(() => {
    const savedSchool = localStorage.getItem("school");
    if (savedSchool) {
      const parsedSchool = JSON.parse(savedSchool);
      form.setValue("name", parsedSchool.name);
      form.setValue("logo", parsedSchool.logo);
      setPreview(parsedSchool.logo);
    }
  }, [form]);

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("head_master", values.head_master);
      formData.append("address", values.address);
      if (values.logo) {
        formData.append("logo", values.logo);
      }

      const res = await authAxios.post("/auth/dashboard/school", formData);

      localStorage.setItem(
        "school",
        JSON.stringify({
          name: res.data.name,
          logo: res.data.logo, 
        })
      );

      toast.success("Informasi sekolah berhasil disimpan!");
      router.push("/auth/dashboard");
    } catch (error) {
      toast.error("Gagal menyimpan data sekolah");
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Pengaturan Sekolah</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Sekolah</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama sekolah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="head_master"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kepala Sekolah</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama kepala sekolah"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Upload Logo Sekolah</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png, image/jpeg"
                      {...fieldProps}
                      onChange={async (e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                        if (file) {
                          const base64 = await toBase64(file);
                          setPreview(base64);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {preview && (
              <div className="flex justify-center">
                <Image
                  src={preview}
                  alt="Preview Logo"
                  width={100}
                  height={100}
                  className="rounded-md border mt-2"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Sekolah</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat sekolah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Simpan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
