import { Metadata } from "next";
import CourseEditorForm from "../CourseEditorForm";

export const metadata: Metadata = { title: "New Course" };

export default function NewCoursePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Course</h1>
      <CourseEditorForm />
    </div>
  );
}
