import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
  } from "@/components/ui/card";
  import Image from "next/image";
  import React from "react";
  import LoginForm from "./component/form";
  
  const LoginPage = () => {
    return (
      <div className="w-full min-h-screen flex">
        {/* Bagian Kiri: Form Login */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md space-y-4">
            <CardHeader className="flex flex-col items-center">
              <Image src="/logo-yrt.png" alt="icon" width={120} height={100} />
              <CardTitle className="text-3xl font-bold mt-2">Selamat Datang</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
  
        {/* Bagian Kanan: Gambar Background */}
        <div className="w-1/2 relative">
          <Image
            src="/sekolah1.jpg" // Ganti dengan path gambar kamu
            alt="Background"
            layout="fill"
            objectFit="cover" // Pastikan gambar mengisi penuh
            className="h-full w-full"
          />
        </div>
      </div>
    );
  };
  
  export default LoginPage;
  