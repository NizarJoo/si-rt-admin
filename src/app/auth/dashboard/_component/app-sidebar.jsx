"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpenText,
  GraduationCap,
  Layers2,
  LogOutIcon,
  School2,
  User2,
  Users,
} from "lucide-react";

import { NavMain } from "@/app/auth/dashboard/_component/nav-main";
import { NavUser } from "@/app/auth/dashboard/_component/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/hooks/use-auth";

const navItems = [
  {
    title: "User",
    url: "/auth/dashboard/user",
    icon: User2,
    isActive: true,
  },
  {
    title: "Kegiatan Sekolah",
    url: "/auth/dashboard/event",
    icon: School2,
    isActive: true,
  },
  {
    title: "Guru ",
    icon: GraduationCap,
    items: [
      { title: "Profil", url: "/auth/dashboard/teacher-profil" },
      { title: "Presensi", url: "/auth/dashboard/teacher-attendance" },
      { title: "Jurnal Mengajar", url: "/auth/dashboard/journal" },
    ],
  },
  {
    title: "Siswa",
    icon: BookOpenText,
    items: [
      { title: "Profil", url: "/auth/dashboard/student" },
      { title: "Presensi", url: "/auth/dashboard/student-attendance" },
      { title: "Aktivitas", url: "/auth/dashboard/activity" },
    ],
  },
  {
    title: "Kelas",
    url: "/auth/dashboard/classes",
    icon: Layers2,
    isActive: true,
  },
  {
    title: "Orangtua",
    url: "/auth/dashboard/parent",
    icon: Users,
    isActive: true,
  },
];

export function AppSidebar(props) {
  const router = useRouter();
  const user = useAuth();

  const [school, setSchool] = React.useState({
    name: "Yayasan Roudlotut Tholibin",
    logo: "/logo-yrt.png",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("school");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSchool({
        name: parsed.name || "Yayasan Roudlotut Tholibin",
        logo: parsed.logo || "/logo-yrt.png",
      });
    }
  }, []);

  const handleLogout = () => {
    destroyCookie(null, "access_token");
    destroyCookie(null, "refresh_token");
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col items-center gap-2 p-4">
        <div
          onClick={() => router.push("/auth/dashboard/profile-school")}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Image
            src={school.logo}
            alt="Logo Sekolah"
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <span className="text-lg font-semibold text-center">
            {school.name}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
        <div className="mt-auto sticky bottom-0 bg-sidebar p-4 flex justify-center">
          <Button
            variant="destructive"
            size="sm"
            className="w-32 flex items-center gap-2 flex-shrink-0"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-4" />
            Logout
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name: "admin", email: "admin@cihuy.com" }} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
