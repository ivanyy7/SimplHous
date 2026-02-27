import { auth } from "@/auth";
import Link from "next/link";
import { getHomeNewsSections } from "@/app/dashboard/actions";
import { PublicNewsCard } from "@/components/home/PublicNewsCard";

export default async function HomePage() {
  const session = await auth();
  const { recentNews, popularNews } = await getHomeNewsSections(session?.user?.id);

  return (
    <div>
      {/* Hero в стиле ProStore: синий баннер */}
      <section className="bg-blue-600 text-white text-center py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold">SimplHous</h1>
          <p className="mt-3 text-blue-100 text-lg md:text-xl">
            Объявления о вакантном жилье — смотрите новые и популярные
          </p>
          <div className="mt-6">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span className="text-xl leading-none">+</span>
                Добавить новость
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-xl leading-none">+</span>
                  Добавить новость
                </Link>
                <p className="text-sm text-blue-200 mt-3">Войдите, чтобы добавлять объявления</p>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
      <section className="mt-8">
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
    </div>
  );
}
