import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AppSidebar from "@/components/app/AppSidebar";
import SessionProvider from "@/components/SessionProvider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session.user.role === "ADMIN") redirect("/admin/dashboard");

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar user={{ name: session.user.name!, username: session.user.username, email: session.user.email! }} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
