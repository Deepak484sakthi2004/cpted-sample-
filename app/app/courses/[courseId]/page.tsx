import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEnrollmentWithProgress } from "@/lib/actions/enrollments";
import { calculateCourseProgress } from "@/lib/actions/progress";
import { Award, CheckCircle, Circle, FileQuestion, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGradeColor } from "@/lib/utils";
import type { Metadata } from "next";

interface Props { params: Promise<{ courseId: string }> }

export const metadata: Metadata = { title: "Course Overview" };

export default async function CourseOverviewPage({ params }: Props) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const enrollment = await getEnrollmentWithProgress(userId, courseId);

  if (!enrollment || enrollment.status !== "ACTIVE") {
    redirect("/app/courses");
  }

  const course = enrollment.course;
  const progress = await calculateCourseProgress(userId, courseId);
  const isCompleted = enrollment.completedAt !== null;

  return (
    <div className="p-6 max-w-4xl">
      {/* Course header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.shortDescription}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-semibold text-blue-700 w-12">{progress}%</span>
        </div>
      </div>

      {/* Completion banner */}
      {isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Award className="h-8 w-8 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Congratulations! You've completed this course.</p>
            <p className="text-sm text-green-600">
              Your certificate is ready.{" "}
              <Link href="/app/certificates" className="underline font-medium">Download it now →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Curriculum accordion */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>
      <div className="space-y-3">
        {course.modules.map((module) => {
          const completedLessons = module.lessons.filter((l) =>
            l.progress.some((p) => p.userId === userId)
          ).length;
          const quizAttempt = module.quiz?.attempts[0];

          return (
            <details key={module.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden" open>
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                <div>
                  <span className="font-semibold text-gray-900">{module.title}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {completedLessons}/{module.lessons.length} lessons
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>

              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {module.lessons.map((lesson) => {
                  const isDone = lesson.progress.some((p) => p.userId === userId);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/app/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${isDone ? "text-gray-600" : "text-gray-800"}`}>
                        {lesson.title}
                      </span>
                    </Link>
                  );
                })}

                {module.quiz && (
                  <Link
                    href={`/app/courses/${courseId}/quiz/${module.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileQuestion className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Module Quiz</span>
                    </div>
                    {quizAttempt ? (
                      <Badge className={`text-xs ${getGradeColor(quizAttempt.grade)}`}>
                        {quizAttempt.passed ? "Passed" : "Failed"} · Grade {quizAttempt.grade}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">Not attempted</span>
                    )}
                  </Link>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
