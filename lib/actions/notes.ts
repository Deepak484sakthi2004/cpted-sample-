"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNote(userId: string, courseId: string) {
  return prisma.note.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

export async function getAllNotes(userId: string) {
  return prisma.note.findMany({
    where: { userId },
    include: { course: { select: { id: true, title: true, slug: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function upsertNote(
  userId: string,
  courseId: string,
  content: string
) {
  await prisma.note.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, content },
    update: { content },
  });

  revalidatePath("/app/notes");
  revalidatePath("/app/dashboard");
  return { success: true };
}
