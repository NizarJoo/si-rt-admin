"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const API_URL = "https://si-erte-production.up.railway.app";

export default function SchoolProfileCard() {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchool = async () => {
    try {
      const { access_token: token } = parseCookies();
      if (!token)
        throw new Error("Token tidak ditemukan. Silakan login ulang.");

      const response = await axios.get(`${API_URL}/auth/dashboard/school`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSchool(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data sekolah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchool();
  }, []);

  if (loading) return <p>Memuat data sekolah...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!school) return null;

 return (
   <Card className="w-full max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
     <div className="flex items-center gap-6">
       <div className="w-24 h-24 relative border rounded-xl overflow-hidden bg-gray-100">
         <Image
           src= "/logo-yrt.png"
          //  {`/uploads/${school.Logo}`}
           alt="Logo Sekolah"
           fill
           className="object-cover"
           unoptimized
         />
       </div>
       <div className="flex-1">
         <CardTitle className="text-2xl font-bold text-gray-800">
           {school.name}
         </CardTitle>
         {/* <p className="text-sm text-gray-500 mt-1">ID Sekolah: {school.ID}</p> */}
       </div>
     </div>

     <CardContent className="mt-6 space-y-3 text-[15px] text-gray-700">
       <div className="flex items-start gap-2">
         <span className="font-semibold min-w-[130px]">Kepala Sekolah</span>
         <span>: {school.head_master}</span>
       </div>
       <div className="flex items-start gap-2">
         <span className="font-semibold min-w-[130px]">Alamat</span>
         <span>: {school.address}</span>
       </div>
     </CardContent>
   </Card>
 );
}
