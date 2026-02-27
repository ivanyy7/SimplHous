import Link from "next/link";

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Контакты</h1>
      <p className="mt-4 text-slate-600">Страница в разработке.</p>
      <Link href="/" className="mt-4 inline-block text-slate-500 hover:text-slate-700 text-sm">
        ← На главную
      </Link>
    </div>
  );
}
