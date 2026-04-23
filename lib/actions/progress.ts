"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function markLessonComplete(
  userId: string,
  lessonId: string,
  courseId: string
) {
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId },
    update: { completedAt: new Date() },
  });

  revalidatePath(`/app/courses/${courseId}`);
  revalidatePath(`/app/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath("/app/dashboard");
  return { success: true };
}

export async function calculateCourseProgress(
  userId: string,
  courseId: string
): Promise<number> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: { include: { lessons: { select: { id: true } } } },
    },
  });

  if (!course) return 0;

  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  if (allLessonIds.length === 0) return 0;

  const completed = await prisma.lessonProgress.count({
    where: { userId, lessonId: { in: allLessonIds } },
  });

  return Math.round((completed / allLessonIds.length) * 100);
}

export async function getCompletedLessonIds(
  userId: string,
  lessonIds: string[]
): Promise<string[]> {
  const progress = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true },
  });
  return progress.map((p) => p.lessonId);
}

export async function submitQuizAttempt(data: {
  userId: string;
  quizId: string;
  courseId: string;
  moduleId: string;
  answers: { questionId: string; selectedAnswer: string }[];
}) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: data.quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) return { error: "Quiz not found" };

  let correctCount = 0;
  const answerData = data.answers.map((a) => {
    const question = quiz.questions.find((q) => q.id === a.questionId);
    const isCorrect = question?.correctAnswer === a.selectedAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      isCorrect: isCorrect ?? false,
    };
  });

  const total = quiz.questions.length;
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = score >= 60;

  let grade = "F";
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: data.userId,
      quizId: data.quizId,
      score,
      grade,
      passed,
      answers: { create: answerData },
    },
    include: {
      answers: { include: { question: true } },
    },
  });

  if (passed) {
    await checkAndCreateCertificate(data.userId, data.courseId);
  }

  revalidatePath(`/app/courses/${data.courseId}`);
  revalidatePath("/app/certificates");
  revalidatePath("/app/dashboard");

  return { success: true, attempt, score, grade, passed };
}

export async function checkAndCreateCertificate(
  userId: string,
  courseId: string
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: { select: { id: true } },
          quiz: { select: { id: true } },
        },
      },
    },
  });

  if (!course) return;

  // Check all lessons completed
  const allLessonIds = course.modules.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );
  if (allLessonIds.length > 0) {
    const completedCount = await prisma.lessonProgress.count({
      where: { userId, lessonId: { in: allLessonIds } },
    });
    if (completedCount < allLessonIds.length) return;
  }

  // Check all quizzes passed (modules with quizzes)
  for (const module of course.modules) {
    if (!module.quiz) continue;
    const latestAttempt = await prisma.quizAttempt.findFirst({
      where: { userId, quizId: module.quiz.id },
      orderBy: { createdAt: "desc" },
    });
    if (!latestAttempt || !latestAttempt.passed) return;
  }

  // All criteria met — create certificate if not already exists
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return;

  const certNumber = `CPTE-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  await prisma.certificate.create({
    data: { userId, courseId, certificateNumber: certNumber },
  });

  await prisma.enrollment.updateMany({
    where: { userId, courseId, status: "ACTIVE" },
    data: { completedAt: new Date() },
  });

  revalidatePath("/app/certificates");
  revalidatePath("/app/dashboard");
}

export async function overrideProgressComplete(
  userId: string,
  courseId: string
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: true,
          quiz: { include: { questions: true } },
        },
      },
    },
  });

  if (!course) return { error: "Course not found" };

  // Mark all lessons complete
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        create: { userId, lessonId: lesson.id },
        update: { completedAt: new Date() },
      });
    }

    // Create 100% passing quiz attempt
    if (module.quiz && module.quiz.questions.length > 0) {
      await prisma.quizAttempt.create({
        data: {
          userId,
          quizId: module.quiz.id,
          score: 100,
          grade: "A",
          passed: true,
          answers: {
            create: module.quiz.questions.map((q) => ({
              questionId: q.id,
              selectedAnswer: q.correctAnswer,
              isCorrect: true,
            })),
          },
        },
      });
    }
  }

  // Create certificate
  const certNumber = `CPTE-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  await prisma.certificate.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, certificateNumber: certNumber },
    update: {},
  });

  await prisma.enrollment.updateMany({
    where: { userId, courseId },
    data: { completedAt: new Date() },
  });

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/app/dashboard");
  revalidatePath("/app/certificates");
  revalidatePath(`/app/courses/${courseId}`);
  return { success: true };
}

export async function toggleLessonComplete(
  userId: string,
  lessonId: string,
  complete: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  if (complete) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId },
      update: { completedAt: new Date() },
    });
  } else {
    await prisma.lessonProgress.deleteMany({ where: { userId, lessonId } });
  }
  return { success: true };
}

export async function getLatestQuizAttempt(userId: string, quizId: string) {
  return prisma.quizAttempt.findFirst({
    where: { userId, quizId },
    orderBy: { createdAt: "desc" },
    include: {
      answers: { include: { question: true } },
    },
  });
}
