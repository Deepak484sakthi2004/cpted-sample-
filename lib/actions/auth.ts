"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function signupAction(data: unknown) {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, username, email, password } = parsed.data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return { error: "Email already in use" };

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) return { error: "Username already taken" };

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, username, email, password: hashedPassword, role: "STUDENT" },
  });

  return { success: true };
}

export async function checkUsernameAvailability(username: string) {
  if (!username || username.length < 3) return { available: false };
  const user = await prisma.user.findUnique({ where: { username } });
  return { available: !user };
}

export async function updateProfile(
  userId: string,
  data: { name: string; username: string; email: string }
) {
  const existingUsername = await prisma.user.findFirst({
    where: { username: data.username, NOT: { id: userId } },
  });
  if (existingUsername) return { error: "Username already taken" };

  const existingEmail = await prisma.user.findFirst({
    where: { email: data.email, NOT: { id: userId } },
  });
  if (existingEmail) return { error: "Email already in use" };

  await prisma.user.update({
    where: { id: userId },
    data: { name: data.name, username: data.username, email: data.email },
  });

  revalidatePath("/app/profile");
  return { success: true };
}

export async function updatePassword(
  userId: string,
  data: { currentPassword: string; newPassword: string; confirmPassword: string }
) {
  if (data.newPassword !== data.confirmPassword) {
    return { error: "New passwords do not match" };
  }
  if (data.newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "User not found" };

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) return { error: "Current password is incorrect" };

  const hashedPassword = await bcrypt.hash(data.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
}
