"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ViewMode = "list" | "grid";

interface ViewModeToggleProps {
  basePath: string;
  currentView: ViewMode;
  q?: string;
  sort?: string;
  labelMode?: "list-grid" | "cards-table";
}

function buildUrl(basePath: string, view: ViewMode, q?: string, sort?: string) {
  const params = new URLSearchParams();
  params.set("view", view);
  if (sort) params.set("sort", sort);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function ViewModeToggle({
  basePath,
  currentView,
  q,
  sort,
  labelMode = "list-grid",
}: ViewModeToggleProps) {
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("simplhous:viewMode") : null;
    if (stored === "list" || stored === "grid") {
      if (stored !== currentView) {
        const url = buildUrl(basePath, stored, q, sort);
        router.replace(url);
      }
    }
  }, [basePath, currentView, q, sort, router]);

  const applyView = (view: ViewMode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("simplhous:viewMode", view);
    }
    const url = buildUrl(basePath, view, q, sort);
    router.push(url);
  };

  const [labelList, labelGrid] =
    labelMode === "cards-table" ? (["Карточки", "Таблица"] as const) : (["Список", "Сетка"] as const);

  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => applyView("list")}
        className={`px-3 py-1 rounded-full text-sm transition-colors ${
          currentView === "list"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        {labelList}
      </button>
      <button
        type="button"
        onClick={() => applyView("grid")}
        className={`px-3 py-1 rounded-full text-sm transition-colors ${
          currentView === "grid"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        {labelGrid}
      </button>
    </div>
  );
}

