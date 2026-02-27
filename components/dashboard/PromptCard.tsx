"use client";

import { MessageSquare, Star, Pencil, Trash2, Globe, Lock } from "lucide-react";
import { useTransition } from "react";
import { deleteNews, toggleNewsPublic, toggleNewsFavorite } from "@/app/dashboard/actions";
import { Visibility } from "@prisma/client";
import { PromptDialog } from "./PromptDialog";
import { useState } from "react";

const PREVIEW_MAX_LEN = 120;

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
    updatedAt: Date;
  };
  isOwner: boolean;
}

export function PromptCard({ news, isOwner }: NewsCardProps) {
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

  return (
    <>
      <div
        className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
          isPending ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        <div className="flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{news.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
              {preview(news.content) || "—"}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  title={news.isFavorite ? "Убрать из избранного" : "В избранное"}
                >
                  <Star
                    className={`w-4 h-4 ${news.isFavorite ? "fill-amber-400 text-amber-500" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleTogglePublic}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  title={news.visibility === "PUBLIC" ? "Сделать приватным" : "Опубликовать"}
                >
                  {news.visibility === "PUBLIC" ? (
                    <Globe className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  title="Редактировать"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <PromptDialog
          mode="edit"
          prompt={news}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
