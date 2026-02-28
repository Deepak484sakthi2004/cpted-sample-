"use server";

import { prisma } from "@/lib/prisma";

export async function getCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { issuedAt: "desc" },
  });
}
