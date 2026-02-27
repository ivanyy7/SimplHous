"use client";

import { ThumbsUp } from "lucide-react";
import { useState } from "react";

interface LikeButtonProps {
  newsId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ newsId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    const prevLiked = liked;
    const prevCount = count;

    // оптимистичное обновление
    setLiked(!prevLiked);
    setCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await fetch(`/api/news/${newsId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        // неавторизован
        setLiked(prevLiked);
        setCount(prevCount);
        alert("Чтобы поставить лайк, войдите в аккаунт.");
        return;
      }

      if (!res.ok) {
        setLiked(prevLiked);
        setCount(prevCount);
        alert("Не удалось обновить лайк. Попробуйте позже.");
        return;
      }

      const data: { liked: boolean; likesCount: number } = await res.json();
      setLiked(data.liked);
      setCount(data.likesCount);
    } catch (e) {
      setLiked(prevLiked);
      setCount(prevCount);
      alert("Произошла ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-colors ${
        liked
          ? "bg-sky-50 border-sky-300 text-sky-700"
          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
      } ${loading ? "opacity-70 cursor-default" : ""}`}
      title={liked ? "Убрать лайк" : "Поставить лайк"}
    >
      <ThumbsUp className={`w-3 h-3 ${liked ? "fill-sky-500 text-sky-600" : ""}`} />
      <span>{count}</span>
    </button>
  );
}

