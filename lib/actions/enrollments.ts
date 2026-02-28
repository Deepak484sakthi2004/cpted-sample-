"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getStudentEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: { orderBy: { order: "asc" } },
              quiz: {
                include: {
                  attempts: {
                    where: { userId },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                  },
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEnrollmentWithProgress(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progress: { where: { userId } },
                },
                orderBy: { order: "asc" },
              },
              quiz: {
                include: {
                  attempts: {
                    where: { userId },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                  },
                  questions: { orderBy: { order: "asc" } },
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}

export async function provisionAccess(data: {
  userId: string;
  courseId: string;
  amount: number;
  notes?: string;
  grantedById: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: data.userId, courseId: data.courseId } },
  });

  if (existing) {
    if (existing.status === "ACTIVE") {
      return { error: "Student already has active access to this course" };
    }
    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { status: "ACTIVE", grantedById: data.grantedById },
    });
  } else {
    await prisma.enrollment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        status: "ACTIVE",
        grantedById: data.grantedById,
      },
    });
  }

  await prisma.order.create({
    data: {
      userId: data.userId,
      courseId: data.courseId,
      amount: data.amount,
      status: "PROVISIONED",
      notes: data.notes,
    },
  });

  revalidatePath(`/admin/users/${data.userId}`);
  revalidatePath("/admin/enrollments");
  revalidatePath("/app/dashboard");
  return { success: true };
}

export async function revokeEnrollment(enrollmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "REVOKED" },
  });

  revalidatePath(`/admin/users/${enrollment.userId}`);
  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function restoreEnrollment(enrollmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "ACTIVE" },
  });

  revalidatePath(`/admin/users/${enrollment.userId}`);
  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function getAllEnrollments(filters?: {
  courseId?: string;
  status?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return [];

  return prisma.enrollment.findMany({
    where: {
      ...(filters?.courseId ? { courseId: filters.courseId } : {}),
      ...(filters?.status && filters.status !== "ALL"
        ? { status: filters.status as any }
        : {}),
    },
    include: {
      user: true,
      course: true,
      grantedBy: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudentOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function checkEnrollment(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  return enrollment?.status === "ACTIVE";
}
