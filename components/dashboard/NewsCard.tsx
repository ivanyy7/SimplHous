"use client";

import { MessageSquare, Star, Pencil, Trash2, Globe, Lock, Copy, Calendar } from "lucide-react";
import { useTransition } from "react";
import { deleteNews, toggleNewsPublic, toggleNewsFavorite } from "@/app/dashboard/actions";
import { Visibility } from "@prisma/client";
import { NewsDialog } from "./NewsDialog";
import { useState } from "react";
import { LikeButton } from "./LikeButton";

const PREVIEW_MAX_LEN = 140;

function preview(text: string | null): string {
  if (!text?.trim()) return "";
  const t = text.trim().replace(/\s+/g, " ");
  return t.length <= PREVIEW_MAX_LEN ? t : t.slice(0, PREVIEW_MAX_LEN) + "…";
}

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    content: string | null;
    visibility: Visibility;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
    likesCount?: number;
    likedByMe?: boolean;
  };
  isOwner: boolean;
  showLikes?: boolean;
}

export function NewsCard({ news, isOwner, showLikes = false }: NewsCardProps) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    if (!confirm("Удалить эту новость?")) return;
    startTransition(async () => {
      await deleteNews(news.id);
    });
  };

  const handleTogglePublic = () => {
    if (!isOwner) return;
    startTransition(async () => {
      await toggleNewsPublic(news.id);
    });
  };

  const handleToggleFavorite = () => {
    if (!isOwner) return;
    startTransition(async () => {
      await toggleNewsFavorite(news.id);
    });
  };

  const handleCopy = async () => {
    const text = `${news.title}\n\n${news.content ?? ""}`.trim();
    try {
      await navigator.clipboard.writeText(text);
      alert("Текст объявления скопирован.");
    } catch {
      alert("Не удалось скопировать текст.");
    }
  };

  const created = new Date(news.createdAt);
  const formattedDate = created.toLocaleDateString("ru-RU");

  return (
    <>
      <div
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-[1px] ${
          isPending ? "opacity-70 pointer-events-none" : ""
        } min-h-[180px] flex`}
      >
        <div className="flex flex-col h-full gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-slate-500" />
              </div>
              <h3 className="font-semibold text-slate-900 truncate">{news.title}</h3>
            </div>
            {isOwner && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  title={news.isFavorite ? "Убрать из избранного" : "В избранное"}
                >
                  <Star
                    className={`w-4 h-4 ${news.isFavorite ? "fill-amber-400 text-amber-500" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleTogglePublic}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  title={news.visibility === "PUBLIC" ? "Сделать приватным" : "Опубликовать"}
                >
                  {news.visibility === "PUBLIC" ? (
                    <Globe className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 mt-1 leading-snug break-words text-left">
            {preview(news.content) || "—"}
          </p>

          <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="relative group w-9 h-9 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-3 py-1 text-sm text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-lg z-10">
                    Дата: {formattedDate}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                {showLikes && news.visibility === "PUBLIC" && (
                  <LikeButton
                    newsId={news.id}
                    initialLiked={Boolean(news.likedByMe)}
                    initialCount={news.likesCount ?? 0}
                  />
                )}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="relative group w-9 h-9 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-3 py-1 text-sm text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-lg z-10">
                    Копировать
                  </span>
                </button>
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="px-3 py-1.5 rounded-md font-medium border border-sky-100 text-sky-700 bg-sky-50 hover:bg-sky-100"
                >
                  Правка
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="ml-auto px-3 py-1.5 rounded-md font-medium border border-red-100 text-red-700 bg-red-50 hover:bg-red-100"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <NewsDialog
          mode="edit"
          prompt={news}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}

