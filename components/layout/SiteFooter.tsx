import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:py-8">
        <p className="text-sm text-slate-500">
          © SimplHous {year}
        </p>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/policy" className="text-slate-500 hover:text-slate-700">
            Политика
          </Link>
          <Link href="/contacts" className="text-slate-500 hover:text-slate-700">
            Контакты
          </Link>
        </nav>
      </div>
    </footer>
  );
}
