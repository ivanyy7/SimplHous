"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNews, updateNews } from "@/app/dashboard/actions";
import { Visibility } from "@prisma/client";

interface NewsDialogProps {
  mode: "create" | "edit";
  prompt?: {
    id: string;
    title: string;
    content: string | null;
    visibility: Visibility;
  };
  onClose: () => void;
}

export function PromptDialog({ mode, prompt, onClose }: NewsDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("isPublic", (form.querySelector("#isPublic") as HTMLInputElement)?.checked ? "true" : "false");
    startTransition(async () => {
      if (mode === "create") {
        const result = await createNews(formData);
        if (result?.ok) {
          router.refresh();
          onClose();
        }
      } else if (prompt) {
        const result = await updateNews(prompt.id, formData);
        if (result?.ok) {
          router.refresh();
          onClose();
        }
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {mode === "create" ? "New News" : "Редактировать News"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Заголовок
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={prompt?.title ?? ""}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              placeholder="Название"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
              Текст
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              defaultValue={prompt?.content ?? ""}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
              placeholder="Содержимое"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              defaultChecked={prompt?.visibility === "PUBLIC"}
              className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="isPublic" className="text-sm text-slate-700">
              Публичный (видят все)
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50"
            >
              {isPending ? "Сохранение…" : mode === "create" ? "Создать" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
