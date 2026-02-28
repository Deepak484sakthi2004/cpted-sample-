"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllCourses, toggleCoursePublished, deleteCourse } from "@/lib/actions/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => getAllCourses().then(setCourses);
  useEffect(() => { load(); }, []);

  const handleToggle = async (courseId: string, title: string, published: boolean) => {
    const result = await toggleCoursePublished(courseId);
    if (result.success) {
      toast.success(`"${title}" ${!published ? "published" : "unpublished"}`);
      load();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteCourse(deleteTarget.id);
    if (result.success) {
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      load();
    } else {
      toast.error(result.error ?? "Delete failed");
    }
    setDeleting(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <Link href="/admin/courses/new">
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet" description="Create your first course to get started." actionLabel="New Course" actionHref="/admin/courses/new" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Enrollments</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded bg-gray-100 flex-shrink-0 overflow-hidden relative">
                        {course.thumbnail ? (
                          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={course.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{course._count?.enrollments ?? 0}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{course.price === 0 ? "Free" : formatCurrency(course.price)}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{formatDate(course.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggle(course.id, course.title, course.published)}
                        className={course.published ? "text-yellow-600 border-yellow-300" : "text-green-600 border-green-300"}
                      >
                        {course.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200"
                        onClick={() => setDeleteTarget(course)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently delete all modules, lessons, quizzes, and enrollment data.`}
        confirmLabel="Delete Course"
        loading={deleting}
      />
    </div>
  );
}
