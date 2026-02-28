import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SessionProvider from "@/components/SessionProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/app/dashboard");

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar user={{ name: session.user.name!, email: session.user.email! }} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
