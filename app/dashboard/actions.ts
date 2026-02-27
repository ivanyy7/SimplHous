"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNewsSchema, updateNewsSchema } from "@/lib/validations/prompt";
import { revalidatePath } from "next/cache";
import { Visibility } from "@prisma/client";

const PAGE_SIZE = 10;
export type PublicNewsSort = "recent" | "popular";

/** Проверка прав: только владелец может изменять/удалять свою новость */
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Необходима авторизация");
  return session.user.id;
}

export async function createNews(formData: FormData) {
  const userId = await getUserId();
  const raw = {
    title: formData.get("title"),
    content: formData.get("content") ?? undefined,
    isPublic: formData.get("isPublic") === "true",
  };
  const parsed = createNewsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await prisma.news.create({
    data: {
      ownerId: userId,
      title: parsed.data.title,
      content: parsed.data.content ?? "",
      visibility: parsed.data.isPublic ? Visibility.PUBLIC : Visibility.PRIVATE,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function updateNews(id: string, formData: FormData) {
  const userId = await getUserId();
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) {
    throw new Error("Нет прав на редактирование этого News");
  }
  const raw = {
    title: formData.get("title"),
    content: formData.get("content") ?? undefined,
    isPublic: formData.get("isPublic") === "true",
  };
  const parsed = updateNewsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await prisma.news.update({
    where: { id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content ?? "",
      visibility: parsed.data.isPublic ? Visibility.PUBLIC : Visibility.PRIVATE,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function deleteNews(id: string) {
  const userId = await getUserId();
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) {
    throw new Error("Нет прав на удаление этого News");
  }
  await prisma.news.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function toggleNewsPublic(id: string) {
  const userId = await getUserId();
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) {
    throw new Error("Нет прав на изменение этого News");
  }
  const nextVisibility = existing.visibility === Visibility.PUBLIC ? Visibility.PRIVATE : Visibility.PUBLIC;
  await prisma.news.update({
    where: { id },
    data: { visibility: nextVisibility },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true, visibility: nextVisibility };
}

export async function toggleNewsFavorite(id: string) {
  const userId = await getUserId();
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) {
    throw new Error("Нет прав на изменение этого News");
  }
  await prisma.news.update({
    where: { id },
    data: { isFavorite: !existing.isFavorite },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function getMyNews(userId: string, page: number, search?: string) {
  const where = {
    ownerId: userId,
    ...(search?.trim()
      ? {
          OR: [
            { title: { contains: search.trim(), mode: "insensitive" as const } },
            { content: { contains: search.trim(), mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [itemsRaw, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: { select: { likes: true } },
      },
    }),
    prisma.news.count({ where }),
  ]);

  const likes = await prisma.like.findMany({
    where: {
      userId,
      newsId: { in: itemsRaw.map((n) => n.id) },
    },
    select: { newsId: true },
  });

  const likedIds = new Set(likes.map((l) => l.newsId));

  const items = itemsRaw.map((news) => ({
    ...news,
    likesCount: news._count.likes,
    likedByMe: likedIds.has(news.id),
  }));

  return { items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getPublicNews(
  page: number,
  search?: string,
  currentUserId?: string,
  sort: PublicNewsSort = "recent",
) {
  const where = {
    visibility: Visibility.PUBLIC,
    ...(search?.trim()
      ? {
          OR: [
            { title: { contains: search.trim(), mode: "insensitive" as const } },
            { content: { contains: search.trim(), mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "popular"
      ? { likes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [itemsRaw, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        owner: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
    }),
    prisma.news.count({ where }),
  ]);

  let likedIds = new Set<string>();
  if (currentUserId && itemsRaw.length > 0) {
    const likes = await prisma.like.findMany({
      where: {
        userId: currentUserId,
        newsId: { in: itemsRaw.map((n) => n.id) },
      },
      select: { newsId: true },
    });
    likedIds = new Set(likes.map((l) => l.newsId));
  }

  const items = itemsRaw.map((news) => ({
    ...news,
    likesCount: news._count.likes,
    likedByMe: likedIds.has(news.id),
  }));

  return { items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getFavoriteNews(userId: string, page: number, search?: string) {
  const where = {
    ownerId: userId,
    isFavorite: true,
    ...(search?.trim()
      ? {
          OR: [
            { title: { contains: search.trim(), mode: "insensitive" as const } },
            { content: { contains: search.trim(), mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.news.count({ where }),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}
