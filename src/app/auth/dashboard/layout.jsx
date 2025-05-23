import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_component/app-sidebar";
import AuthContextProvider from "@/_context/auth-context-provider";
import GPQueryContext from "@/_context/query-provider";
import { Toaster } from "@/components/ui/sonner"; 

export default function Layout({ children }) {
  return (
    <GPQueryContext>
      <AuthContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="w-full overflow-x-auto">
            <section className="w-full p-4">{children}</section>
          </SidebarInset>
        </SidebarProvider>
        <Toaster position="top-right" /> 
      </AuthContextProvider>
    </GPQueryContext>
  );
}
