"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  ShoppingBag,
  FileText,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/courses", label: "My Courses", icon: BookOpen },
  { href: "/app/certificates", label: "Certificates", icon: Award },
  { href: "/app/orders", label: "Order History", icon: ShoppingBag },
  { href: "/app/notes", label: "Notes", icon: FileText },
  { href: "/app/profile", label: "Profile", icon: User },
];

interface AppSidebarProps {
  user: {
    name: string;
    username: string;
    email: string;
  };
}

function SidebarContent({ user, pathname, onNavigate }: { user: AppSidebarProps["user"]; pathname: string; onNavigate?: () => void }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Logged out successfully");
  };

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-blue-800">CPTEDINDIA</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">@{user.username}</p>
            <span className="inline-block mt-0.5 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Student</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </>
  );
}

export default function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-blue-800">CPTEDINDIA</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white">
            <div className="flex flex-col h-full">
              <SidebarContent user={user} pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-white border-r border-gray-200 flex-col min-h-screen">
        <SidebarContent user={user} pathname={pathname} />
      </aside>
    </>
  );
}
