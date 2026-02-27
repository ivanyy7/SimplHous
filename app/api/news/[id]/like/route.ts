import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Visibility } from "@prisma/client";

export async function POST(
  _req: Request,
  // Next.js ругается на строгий тип контекста, поэтому используем any
  { params }: any,
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
    }

    const newsId = params.id;

    const news = await prisma.news.findUnique({
      where: { id: newsId, visibility: Visibility.PUBLIC },
    });

    if (!news) {
      return NextResponse.json({ error: "Новость не найдена или недоступна" }, { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_newsId: {
          userId,
          newsId,
        },
      },
    });

    let liked: boolean;

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      liked = false;
    } else {
      await prisma.like.create({
        data: {
          userId,
          newsId,
        },
      });
      liked = true;
    }

    const likesCount = await prisma.like.count({
      where: { newsId },
    });

    return NextResponse.json({ liked, likesCount });
  } catch (error) {
    console.error("[NEWS_LIKE_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Не удалось обновить лайк. Попробуйте позже." },
      { status: 500 },
    );
  }
}

