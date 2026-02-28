import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TipTapContent from "@/components/TipTapContent";
import { getCourseBySlug } from "@/lib/actions/courses";
import { formatCurrency, getLevelColor } from "@/lib/utils";
import { Clock, ChevronDown, BookOpen, FileQuestion } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return {
    title: course?.title ?? "Course Not Found",
    description: course?.shortDescription ?? "",
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course || !course.published) notFound();

  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className={`mb-4 ${getLevelColor(course.level)}`}>
                {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 mb-6">{course.shortDescription}</p>
              <div className="flex items-center gap-4 text-sm text-blue-200 mb-6">
                {course.estimatedDuration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.estimatedDuration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {totalLessons} lessons
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">
                  {course.price === 0 ? "Free" : formatCurrency(course.price)}
                </span>
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-semibold">
                    Get Access — Sign Up
                  </Button>
                </Link>
              </div>
            </div>
            {course.thumbnail && (
              <div className="relative h-56 rounded-xl overflow-hidden">
                <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Full description */}
            {course.fullDescription && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                <TipTapContent content={course.fullDescription} />
              </div>
            )}

            {/* Curriculum */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              <div className="space-y-3">
                {course.modules.map((module) => (
                  <details key={module.id} className="group border border-gray-200 rounded-lg">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold text-gray-900">{module.title}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({module.lessons.length} lessons{module.quiz ? " + Quiz" : ""})
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 space-y-1">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-2 py-1.5 text-sm text-gray-600">
                          <BookOpen className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                          {lesson.title}
                        </div>
                      ))}
                      {module.quiz && (
                        <div className="flex items-center gap-2 py-1.5 text-sm text-blue-600">
                          <FileQuestion className="h-3.5 w-3.5 flex-shrink-0" />
                          Module Quiz included
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {course.price === 0 ? "Free" : formatCurrency(course.price)}
              </p>
              <Link href="/auth/signup" className="block">
                <Button className="w-full bg-blue-700 hover:bg-blue-800 mb-3">
                  Get Access — Sign Up
                </Button>
              </Link>
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full">
                  Already enrolled? Log In
                </Button>
              </Link>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>✓ {course.modules.length} modules</p>
                <p>✓ {totalLessons} lessons</p>
                {course.estimatedDuration && <p>✓ {course.estimatedDuration}</p>}
                <p>✓ Verified certificate on completion</p>
                <p>✓ Lifetime access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to get started?</h3>
          <p className="text-gray-600 mb-6">Create a free account and wait for your instructor to grant you access.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800 font-semibold px-10">
              Sign Up for Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
