import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/actions/courses";
import CourseEditorForm from "../../CourseEditorForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Course" };

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  const initialMeta = {
    title: course.title,
    slug: course.slug,
    shortDescription: course.shortDescription ?? "",
    fullDescription: course.fullDescription ?? "",
    price: course.price,
    level: course.level,
    estimatedDuration: course.estimatedDuration ?? "",
    tags: course.tags,
    thumbnail: course.thumbnail ?? "",
    featured: course.featured,
    published: course.published,
  };

  const initialModules = course.modules.map((m) => ({
    id: m.id,
    title: m.title,
    order: m.order,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      content: l.content ?? "",
      order: l.order,
    })),
    quiz: m.quiz
      ? {
          id: m.quiz.id,
          title: m.quiz.title,
          questions: m.quiz.questions.map((q) => ({
            id: q.id,
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation ?? "",
          })),
        }
      : null,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Course</h1>
      <CourseEditorForm
        courseId={id}
        initialMeta={initialMeta}
        initialModules={initialModules}
      />
    </div>
  );
}
