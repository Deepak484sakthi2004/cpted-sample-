"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function getAllUsers(search?: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return [];

  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } },
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { course: true, grantedBy: true },
        orderBy: { createdAt: "desc" },
      },
      orders: {
        include: { course: true },
        orderBy: { createdAt: "desc" },
      },
      certificates: {
        include: { course: true },
        orderBy: { issuedAt: "desc" },
      },
      quizAttempts: {
        include: {
          quiz: {
            include: {
              module: { include: { course: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createUser(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "STUDENT" | "ADMIN";
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) return { error: "Email already in use" };

  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
  if (existingUsername) return { error: "Username already taken" };

  const hashedPassword = await bcrypt.hash(data.password, 12);
  await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
    role?: "STUDENT" | "ADMIN";
    password?: string;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.role) updateData.role = data.role;
  if (data.password && data.password.length >= 8) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  await prisma.user.update({ where: { id: userId }, data: updateData });
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function changeUserRole(userId: string, newRole: "STUDENT" | "ADMIN") {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.user.update({ where: { id: userId }, data: { role: newRole } });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function revokeCertificate(certificateId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const cert = await prisma.certificate.delete({ where: { id: certificateId } });

  await prisma.enrollment.updateMany({
    where: { userId: cert.userId, courseId: cert.courseId },
    data: { completedAt: null },
  });

  revalidatePath(`/admin/users/${cert.userId}`);
  revalidatePath("/app/certificates");
  return { success: true };
}
