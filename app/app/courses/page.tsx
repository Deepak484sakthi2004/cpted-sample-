import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentEnrollments } from "@/lib/actions/enrollments";
import { calculateCourseProgress } from "@/lib/actions/progress";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Courses" };

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const enrollments = await getStudentEnrollments(userId);
  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (e) => ({
      ...e,
      progress: await calculateCourseProgress(userId, e.courseId),
    }))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h1>

      {enrollmentsWithProgress.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses enrolled yet"
          description="You don't have access to any courses yet. Your instructor will grant you access."
          actionLabel="Browse Courses"
          actionHref="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
  );
}
