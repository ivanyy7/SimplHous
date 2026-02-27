import { auth } from "@/auth";
import Link from "next/link";
import { getHomeNewsSections } from "@/app/dashboard/actions";
import { PublicNewsCard } from "@/components/home/PublicNewsCard";

export default async function HomePage() {
  const session = await auth();
  const { recentNews, popularNews } = await getHomeNewsSections(session?.user?.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <section className="text-center py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">SimplHous</h1>
        <p className="mt-2 text-slate-600 text-lg">
          Объявления о вакантном жилье — смотрите новые и популярные
        </p>
        {session?.user ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 mt-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Добавить новость
          </Link>
        ) : (
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Добавить новость
            </Link>
            <p className="text-sm text-slate-500 mt-2">Войдите, чтобы добавлять объявления</p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Новые</h2>
        {recentNews.length === 0 ? (
          <p className="text-slate-500 py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
            Публичных объявлений пока нет
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {recentNews.map((news) => (
              <PublicNewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Популярные</h2>
        {popularNews.length === 0 ? (
          <p className="text-slate-500 py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
            Пока нет лайков — популярные появятся позже
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {popularNews.map((news) => (
              <PublicNewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
