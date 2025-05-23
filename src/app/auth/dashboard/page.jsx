import CardOverview from "./_component/card-overview";
import { School2, BookOpenText, GraduationCap } from "lucide-react";

export default function DashboardPage() {
  const data = [
    {
      title: "Jumlah Event",
      value: 150,
      description: "Event Terlaksana",
      Icon: School2,
    },
    {
      title: "Jumlah Guru",
      value: 50,
      description: "Guru Tervalidasi",
      Icon: GraduationCap,
    },
    {
      title: "Jumlah Siswa",
      value: 500,
      description: "Siswa Terdaftar",
      Icon: BookOpenText,
    },
    {
      title: "Jumlah Ortu",
      value: 500,
      description: "Siswa Terdaftar",
      Icon: BookOpenText,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold mt-4 mb-4">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {data.map((stat, index) => (
          <CardOverview key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
