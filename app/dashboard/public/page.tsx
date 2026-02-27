import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPublicNews, type PublicNewsSort } from "../actions";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { Pagination } from "@/components/dashboard/Pagination";
import { Suspense } from "react";
import Link from "next/link";

export default async function DashboardPublicPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: PublicNewsSort }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  const q = params?.q ?? undefined;
  const sort: PublicNewsSort = params?.sort === "popular" ? "popular" : "recent";

  const currentUserId = session.user.id;
  const { items, totalPages } = await getPublicNews(page, q, currentUserId, sort);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Личный кабинет</h1>
      <h2 className="text-lg font-medium text-slate-600 mt-1">Публичные News</h2>

      <div className="flex flex-wrap items-center gap-4 mt-6">
        <Suspense fallback={<div className="h-9 w-48 bg-slate-100 rounded-lg animate-pulse" />}>
          <SearchInput placeholder="Поиск…" />
        </Suspense>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Сортировать:</span>
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            <Link
              href={`/dashboard/public?sort=recent${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-3 py-1 rounded-full transition-colors ${
                sort === "recent"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              По дате
            </Link>
            <Link
              href={`/dashboard/public?sort=popular${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-3 py-1 rounded-full transition-colors ${
                sort === "popular"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              По лайкам
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-slate-500 py-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            Публичных News пока нет
          </p>
        ) : (
          items.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
              isOwner={news.ownerId === currentUserId}
              showLikes
            />
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
