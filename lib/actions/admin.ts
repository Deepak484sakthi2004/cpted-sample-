"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;

  const [totalUsers, activeCourses, totalEnrollments, revenueResult] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count({ where: { published: true } }),
      prisma.enrollment.count({ where: { status: "ACTIVE" } }),
      prisma.order.aggregate({ _sum: { amount: true } }),
    ]);

  return {
    totalUsers,
    activeCourses,
    totalEnrollments,
    totalRevenue: revenueResult._sum.amount ?? 0,
  };
}

export async function getPublicStats() {
  const [courses, students, certificates] = await Promise.all([
    prisma.course.count({ where: { published: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.certificate.count(),
  ]);
  return { courses, students, certificates };
}

export async function getRecentEnrollments(limit = 10) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return [];

  return prisma.enrollment.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: true, course: true, grantedBy: true },
  });
}

export async function getRevenueData() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return [];

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { amount: true, createdAt: true },
  });

  const monthlyData: Record<string, number> = {};
  orders.forEach((o) => {
    const key = `${o.createdAt.getFullYear()}-${String(
      o.createdAt.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyData[key] = (monthlyData[key] ?? 0) + o.amount;
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));
}

export async function getEnrollmentData() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return [];

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const enrollments = await prisma.enrollment.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });

  const monthlyData: Record<string, number> = {};
  enrollments.forEach((e) => {
    const key = `${e.createdAt.getFullYear()}-${String(
      e.createdAt.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyData[key] = (monthlyData[key] ?? 0) + 1;
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, enrollments]) => ({ month, enrollments }));
}

export async function getEmailTemplates() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return [];

  return prisma.emailTemplate.findMany({ orderBy: { name: "asc" } });
}

export async function updateEmailTemplate(
  id: string,
  data: { subject: string; body: string }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.emailTemplate.update({ where: { id }, data });
  return { success: true };
}

export async function sendEmail(data: {
  templateName: string;
  variables: Record<string, string>;
  to: string;
}) {
  const template = await prisma.emailTemplate.findUnique({
    where: { name: data.templateName },
  });
  if (!template) return;

  let subject = template.subject;
  let body = template.body;

  for (const [key, value] of Object.entries(data.variables)) {
    subject = subject.replace(new RegExp(`{{${key}}}`, "g"), value);
    body = body.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  // Log the email (plug in Resend/Nodemailer here later)
  console.log(`[EMAIL] To: ${data.to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${body.replace(/<[^>]+>/g, " ").slice(0, 200)}...`);
}

export async function getStudentDashboardData(userId: string) {
  const [enrollments, certificates, orders, notes] = await Promise.all([
    prisma.enrollment.count({ where: { userId, status: "ACTIVE" } }),
    prisma.certificate.count({ where: { userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.note.findMany({
      where: { userId, NOT: { content: null } },
      include: { course: { select: { title: true } } },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
  ]);

  return { enrollments, certificates, orders, recentNotes: notes };
}
