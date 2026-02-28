import { getDashboardStats, getRecentEnrollments, getRevenueData, getEnrollmentData } from "@/lib/actions/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, BookOpen, UserCheck, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import AdminCharts from "./AdminCharts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [stats, recentEnrollments, revenueData, enrollmentData] = await Promise.all([
    getDashboardStats(),
    getRecentEnrollments(10),
    getRevenueData(),
    getEnrollmentData(),
  ]);

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "bg-blue-500", textColor: "text-blue-600" },
    { label: "Active Courses", value: stats?.activeCourses ?? 0, icon: BookOpen, color: "bg-green-500", textColor: "text-green-600" },
    { label: "Total Enrollments", value: stats?.totalEnrollments ?? 0, icon: UserCheck, color: "bg-yellow-500", textColor: "text-yellow-600" },
    { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue ?? 0), icon: DollarSign, color: "bg-purple-500", textColor: "text-purple-600" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AdminCharts revenueData={revenueData} enrollmentData={enrollmentData} />

      {/* Recent enrollments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Recent Enrollments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEnrollments.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/users/${e.userId}`} className="hover:underline">
                      <p className="text-sm font-medium text-gray-900">{e.user.username}</p>
                      <p className="text-xs text-gray-500">{e.user.email}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{e.course.title}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">₹0.00</td>
                  <td className="px-5 py-3">
                    <Badge className={e.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {e.status === "ACTIVE" ? "Active" : "Revoked"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
