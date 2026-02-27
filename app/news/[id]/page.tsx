import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicNewsById } from "@/app/dashboard/actions";
import { LikeButton } from "@/components/dashboard/LikeButton";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const news = await getPublicNewsById(id, session?.user?.id);

  if (!news) notFound();

  const created = new Date(news.createdAt);
  const formattedDate = created.toLocaleDateString("ru-RU");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-4 inline-block">
        ← На главную
      </Link>
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{news.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {news.owner?.name && <span>Автор: {news.owner.name}</span>}
          <span>{formattedDate}</span>
        </div>
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {news.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
          {news.content}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
          <LikeButton
            newsId={news.id}
            initialLiked={news.likedByMe}
            initialCount={news.likesCount}
          />
        </div>
      </article>
    </div>
  );
}
