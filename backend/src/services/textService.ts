// src/services/textService.ts
import { prisma } from "@/lib/prisma";

export async function createText(userId: string, title: string, raw: string) {
  const text = await prisma.text.create({
    data: {
      userId,
      title: title ?? "",
      raw,
    },
  });
  return text;
}

export async function getUserTexts(userId: string) {
  return prisma.text.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTextByIdForUser(id: string, userId: string) {
  const text = await prisma.text.findUnique({ where: { id } });
  if (!text) return null;
  if (text.userId !== userId) return null;
  return text;
}

export async function deleteTextForUser(id: string, userId: string) {
  // deleteMany ensures we only remove rows belonging to this user
  const result = await prisma.text.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
