import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyNews } from "./actions";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { NewNewsButton } from "@/components/dashboard/NewNewsButton";
import { Pagination } from "@/components/dashboard/Pagination";
import { Suspense } from "react";

const PAGE_SIZE = 10;

export default async function DashboardMyNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  const q = params?.q ?? undefined;

  const { items, totalPages } = await getMyNews(session.user.id, page, q);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Личный кабинет</h1>
      <h2 className="text-lg font-medium text-slate-600 mt-1">Мои News</h2>

      <div className="flex flex-wrap items-center gap-4 mt-6">
        <Suspense fallback={<div className="h-9 w-48 bg-slate-100 rounded-lg animate-pulse" />}>
          <SearchInput placeholder="Поиск по заголовку и тексту…" />
        </Suspense>
        <NewNewsButton />
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-slate-500 py-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            У вас пока нет News — создайте первый
          </p>
        ) : (
          items.map((news) => (
            <NewsCard key={news.id} news={news} isOwner />
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
