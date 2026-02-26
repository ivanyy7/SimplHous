import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Личный кабинет</h1>
      <h2 className="text-lg font-medium text-slate-600 mt-1">История</h2>
      <p className="text-slate-500 mt-6 py-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
        Скоро…
      </p>
    </div>
  );
}
