"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPromptSchema, updatePromptSchema } from "@/lib/validations/prompt";
import { revalidatePath } from "next/cache";
import { Visibility } from "@prisma/client";

const PAGE_SIZE = 10;

/** Проверка прав: только владелец может изменять/удалять свой prompt */
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Необходима авторизация");
  return session.user.id;
}

export async function createPrompt(formData: FormData) {
  const userId = await getUserId();
  const raw = {
    title: formData.get("title"),
    content: formData.get("content") ?? undefined,
    isPublic: formData.get("isPublic") === "true",
  };
  const parsed = createPromptSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await prisma.prompt.create({
    data: {
      userId,
      title: parsed.data.title,
      content: parsed.data.content ?? null,
      visibility: parsed.data.isPublic ? Visibility.PUBLIC : Visibility.PRIVATE,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function updatePrompt(id: string, formData: FormData) {
  const userId = await getUserId();
  const existing = await prisma.prompt.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Нет прав на редактирование этого News");
  }
  const raw = {
    title: formData.get("title"),
    content: formData.get("content") ?? undefined,
    isPublic: formData.get("isPublic") === "true",
  };
  const parsed = updatePromptSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await prisma.prompt.update({
    where: { id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content ?? null,
      visibility: parsed.data.isPublic ? Visibility.PUBLIC : Visibility.PRIVATE,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function deletePrompt(id: string) {
  const userId = await getUserId();
  const existing = await prisma.prompt.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Нет прав на удаление этого News");
  }
  await prisma.prompt.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function togglePromptPublic(id: string) {
  const userId = await getUserId();
  const existing = await prisma.prompt.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Нет прав на изменение этого News");
  }
  const nextVisibility = existing.visibility === Visibility.PUBLIC ? Visibility.PRIVATE : Visibility.PUBLIC;
  await prisma.prompt.update({
    where: { id },
    data: { visibility: nextVisibility },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true, visibility: nextVisibility };
}

export async function togglePromptFavorite(id: string) {
  const userId = await getUserId();
  const existing = await prisma.prompt.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Нет прав на изменение этого News");
  }
  await prisma.prompt.update({
    where: { id },
    data: { isFavorite: !existing.isFavorite },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return { ok: true };
}

export async function getMyPrompts(userId: string, page: number, search?: string) {
  const where = {
    userId,
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
    prisma.prompt.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.prompt.count({ where }),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getPublicPrompts(page: number, search?: string) {
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
  const [items, total] = await Promise.all([
    prisma.prompt.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.prompt.count({ where }),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getFavoritePrompts(userId: string, page: number, search?: string) {
  const where = {
    userId,
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
    prisma.prompt.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.prompt.count({ where }),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}
