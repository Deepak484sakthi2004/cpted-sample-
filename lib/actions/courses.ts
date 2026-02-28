"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getPublishedCourses() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } },
          quiz: true,
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true } },
    },
  });
}

export async function getFeaturedCourses() {
  return prisma.course.findMany({
    where: { published: true, featured: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } },
          quiz: { include: { questions: { orderBy: { order: "asc" } } } },
        },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } },
          quiz: { include: { questions: { orderBy: { order: "asc" } } } },
        },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getAllCourses() {
  return prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } },
    },
  });
}

export async function createCourse(data: {
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  price?: number;
  level?: string;
  estimatedDuration?: string;
  tags?: string[];
  thumbnail?: string;
  featured?: boolean;
  published?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const slugExists = await prisma.course.findUnique({ where: { slug: data.slug } });
  if (slugExists) return { error: "Slug already in use" };

  const course = await prisma.course.create({
    data: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      price: data.price ?? 0,
      level: (data.level as any) ?? "BEGINNER",
      estimatedDuration: data.estimatedDuration,
      tags: data.tags ?? [],
      thumbnail: data.thumbnail,
      featured: data.featured ?? false,
      published: data.published ?? false,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true, courseId: course.id };
}

export async function updateCourseMeta(courseId: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const slugExists = await prisma.course.findFirst({
    where: { slug: data.slug, NOT: { id: courseId } },
  });
  if (slugExists) return { error: "Slug already in use by another course" };

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      price: data.price,
      level: data.level,
      estimatedDuration: data.estimatedDuration,
      tags: data.tags ?? [],
      thumbnail: data.thumbnail,
      featured: data.featured,
      published: data.published,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}/edit`);
  revalidatePath("/courses");
  return { success: true };
}

export async function toggleCoursePublished(courseId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };

  await prisma.course.update({
    where: { id: courseId },
    data: { published: !course.published },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true, published: !course.published };
}

export async function deleteCourse(courseId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}

// ─── MODULE ACTIONS ────────────────────────────────────────────────────────

export async function createModule(courseId: string, title: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const lastModule = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });

  const module = await prisma.module.create({
    data: { courseId, title, order: (lastModule?.order ?? -1) + 1 },
    include: { lessons: true, quiz: { include: { questions: { orderBy: { order: "asc" } } } } },
  });

  revalidatePath(`/admin/courses/${courseId}/edit`);
  return { success: true, module };
}

export async function updateModule(moduleId: string, title: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.module.update({ where: { id: moduleId }, data: { title } });
  return { success: true };
}

export async function deleteModule(moduleId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) return { error: "Module not found" };

  await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath(`/admin/courses/${mod.courseId}/edit`);
  return { success: true };
}

export async function reorderModules(courseId: string, orderedIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.module.update({ where: { id }, data: { order: index } })
    )
  );
  return { success: true };
}

// ─── LESSON ACTIONS ────────────────────────────────────────────────────────

export async function createLesson(moduleId: string, title: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const lastLesson = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
  });

  const lesson = await prisma.lesson.create({
    data: { moduleId, title, content: "", order: (lastLesson?.order ?? -1) + 1 },
  });

  return { success: true, lesson };
}

export async function updateLesson(
  lessonId: string,
  data: { title?: string; content?: string }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.lesson.update({ where: { id: lessonId }, data });
  return { success: true };
}

export async function deleteLesson(lessonId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.lesson.delete({ where: { id: lessonId } });
  return { success: true };
}

export async function reorderLessons(moduleId: string, orderedIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.lesson.update({ where: { id }, data: { order: index } })
    )
  );
  return { success: true };
}

// ─── QUIZ ACTIONS ─────────────────────────────────────────────────────────

export async function upsertQuiz(
  moduleId: string,
  data: {
    title: string;
    questions: {
      text: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: string;
      explanation?: string;
    }[];
  }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const existing = await prisma.quiz.findUnique({ where: { moduleId } });

  if (existing) {
    await prisma.question.deleteMany({ where: { quizId: existing.id } });
    await prisma.quiz.update({
      where: { id: existing.id },
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((q, i) => ({
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: i,
          })),
        },
      },
    });
  } else {
    await prisma.quiz.create({
      data: {
        moduleId,
        title: data.title,
        questions: {
          create: data.questions.map((q, i) => ({
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: i,
          })),
        },
      },
    });
  }

  return { success: true };
}

export async function getLessonById(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: true,
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });
}
