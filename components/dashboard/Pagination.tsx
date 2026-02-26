"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-6" aria-label="Пагинация">
      {page > 1 ? (
        <Link
          href={buildUrl(page - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" /> Назад
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-400 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Назад
        </span>
      )}
      <span className="text-sm text-slate-500 px-2">
        {page} из {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={buildUrl(page + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
        >
          Вперёд <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-400 cursor-not-allowed">
          Вперёд <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
