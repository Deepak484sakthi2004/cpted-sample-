import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentEnrollments } from "@/lib/actions/enrollments";
import { getStudentDashboardData } from "@/lib/actions/admin";
import { calculateCourseProgress } from "@/lib/actions/progress";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, ShoppingBag, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const userName = session!.user.name ?? "Student";

  const [enrollments, dashData] = await Promise.all([
    getStudentEnrollments(userId),
    getStudentDashboardData(userId),
  ]);

  // Calculate progress for each enrollment
  const enrollmentsWithProgress = await Promise.all(
    enrollments.slice(0, 4).map(async (e) => ({
      ...e,
      progress: await calculateCourseProgress(userId, e.courseId),
    }))
  );

  const stats = [
    { label: "Enrolled Courses", value: dashData.enrollments, icon: BookOpen, color: "bg-blue-500" },
    { label: "Certificates Earned", value: dashData.certificates, icon: Award, color: "bg-green-500" },
    { label: "Total Orders", value: dashData.orders, icon: ShoppingBag, color: "bg-purple-500" },
  ];

  return (
    <div className="p-6 max-w-6xl">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {userName}!</h1>
        <p className="text-blue-100">Continue your learning journey and achieve your goals.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
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

      {/* My Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <Link href="/app/courses" className="text-sm text-blue-700 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {enrollmentsWithProgress.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Your enrolled courses will appear here once your instructor grants you access."
              actionLabel="Browse Courses"
              actionHref="/courses"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {enrollmentsWithProgress.map((e) => {
              const progress = e.progress;
              const label = progress === 100 ? "Review Course" : progress > 0 ? "Continue" : "Start Course";
              return (
                <CourseCard
                  key={e.id}
                  id={e.courseId}
                  title={e.course.title}
                  shortDescription={e.course.shortDescription}
                  thumbnail={e.course.thumbnail}
                  level={e.course.level}
                  price={e.course.price}
                  progress={progress}
                  actionLabel={label}
                  actionHref={`/app/courses/${e.courseId}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Notes */}
      {dashData.recentNotes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Notes</h2>
            <Link href="/app/notes" className="text-sm text-blue-700 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {dashData.recentNotes.map((note) => (
              <Link key={note.id} href="/app/notes" className="block">
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{note.course.title}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {note.content?.replace(/<[^>]+>/g, " ").slice(0, 120)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
