import { prisma } from "@/lib/prisma";

export async function createAudio(
  userId: string,
  title: string,
  url: string,
  durationS: number
) {
  return prisma.audio.create({
    data: {
      userId,
      title,
      url,
      durationS,
      genreTags: [],   // start empty
      embedding: [],   // start empty
    },
  });
}

export async function getUserAudios(userId: string) {
  return prisma.audio.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAudioById(userId: string, id: string) {
  return prisma.audio.findFirst({
    where: { id, userId },
  });
}

export async function deleteAudio(userId: string, id: string) {
  return prisma.audio.deleteMany({
    where: { id, userId },
  });
}
