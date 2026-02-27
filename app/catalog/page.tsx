import { auth } from "@/auth";
import { getPublicNews } from "@/app/dashboard/actions";
import { PublicNewsCard } from "@/components/home/PublicNewsCard";
import Link from "next/link";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  const sort = params?.sort === "popular" ? "popular" : "recent";

  const { items, totalPages } = await getPublicNews(
    page,
    undefined,
    session?.user?.id,
    sort
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900">Каталог</h1>
      <p className="mt-1 text-slate-600">Публичные объявления</p>
      <div className="flex gap-2 mt-4">
        <Link
          href="/catalog?sort=recent"
          className={`rounded-md px-3 py-1.5 text-sm ${
            sort === "recent" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          По дате
        </Link>
        <Link
          href="/catalog?sort=popular"
          className={`rounded-md px-3 py-1.5 text-sm ${
            sort === "popular" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          По лайкам
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-slate-500 py-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
          Публичных объявлений пока нет
        </p>
      ) : (
        <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {items.map((news) => (
            <PublicNewsCard
              key={news.id}
              news={{
                ...news,
                tags: news.tags,
              }}
            />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/catalog?page=${page - 1}${sort ? `&sort=${sort}` : ""}`}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Назад
            </Link>
          )}
          <span className="px-3 py-1.5 text-sm text-slate-500">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/catalog?page=${page + 1}${sort ? `&sort=${sort}` : ""}`}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Вперёд
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
