"use client";

import Link from "next/link";
import { Globe, Calendar } from "lucide-react";
import { LikeButton } from "@/components/dashboard/LikeButton";

const PREVIEW_MAX_LEN = 120;

function preview(text: string | null): string {
  if (!text?.trim()) return "";
  const t = text.trim().replace(/\s+/g, " ");
  return t.length <= PREVIEW_MAX_LEN ? t : t.slice(0, PREVIEW_MAX_LEN) + "…";
}

interface PublicNewsCardProps {
  news: {
    id: string;
    title: string;
    content: string | null;
    createdAt: Date;
    owner?: { name: string | null } | null;
    tags?: { name: string }[];
    likesCount?: number;
    likedByMe?: boolean;
  };
}

export function PublicNewsCard({ news }: PublicNewsCardProps) {
  const created = new Date(news.createdAt);
  const formattedDate = created.toLocaleDateString("ru-RU");

  return (
    <div className="rounded-t-2xl rounded-b-xl border border-slate-200 border-t-4 border-t-green-500 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-[1px] min-h-[160px] flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{news.title}</h3>
          <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-green-600" />
          </div>
        </div>
      </div>
      {news.owner?.name && (
        <p className="text-xs text-slate-500 mt-1">Автор: {news.owner.name}</p>
      )}
      <p className="text-sm text-slate-500 mt-1 leading-snug break-words text-left line-clamp-2">
        {preview(news.content) || "—"}
      </p>
      {news.tags && news.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {news.tags.map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1" title={`Дата: ${formattedDate}`}>
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LikeButton
            newsId={news.id}
            initialLiked={Boolean(news.likedByMe)}
            initialCount={news.likesCount ?? 0}
          />
          <Link
            href={`/news/${news.id}`}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Открыть
          </Link>
        </div>
      </div>
    </div>
  );
}
