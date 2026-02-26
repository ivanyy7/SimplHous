"use client";

import { MessageSquare, Star, Pencil, Trash2, Globe, Lock } from "lucide-react";
import { useTransition } from "react";
import {
  deletePrompt,
  togglePromptPublic,
  togglePromptFavorite,
} from "@/app/dashboard/actions";
import { Visibility } from "@prisma/client";
import { PromptDialog } from "./PromptDialog";
import { useState } from "react";

const PREVIEW_MAX_LEN = 120;

function preview(text: string | null): string {
  if (!text?.trim()) return "";
  const t = text.trim().replace(/\s+/g, " ");
  return t.length <= PREVIEW_MAX_LEN ? t : t.slice(0, PREVIEW_MAX_LEN) + "…";
}

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    content: string | null;
    visibility: Visibility;
    isFavorite: boolean;
    updatedAt: Date;
  };
  isOwner: boolean;
}

export function PromptCard({ prompt, isOwner }: PromptCardProps) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    if (!confirm("Удалить этот News?")) return;
    startTransition(async () => {
      await deletePrompt(prompt.id);
    });
  };

  const handleTogglePublic = () => {
    if (!isOwner) return;
    startTransition(async () => {
      await togglePromptPublic(prompt.id);
    });
  };

  const handleToggleFavorite = () => {
    if (!isOwner) return;
    startTransition(async () => {
      await togglePromptFavorite(prompt.id);
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
            <h3 className="font-semibold text-slate-900 truncate">{prompt.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
              {preview(prompt.content) || "—"}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  title={prompt.isFavorite ? "Убрать из избранного" : "В избранное"}
                >
                  <Star
                    className={`w-4 h-4 ${prompt.isFavorite ? "fill-amber-400 text-amber-500" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleTogglePublic}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  title={prompt.visibility === "PUBLIC" ? "Сделать приватным" : "Опубликовать"}
                >
                  {prompt.visibility === "PUBLIC" ? (
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
          prompt={prompt}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
