import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          SimplHous
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Главная
          </Link>
          <Link href="/catalog" className="text-slate-600 hover:text-slate-900">
            Каталог
          </Link>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
            Мои новости
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              )}
              <span className="hidden text-sm text-slate-600 sm:inline">
                {session.user.name ?? session.user.email ?? "Пользователь"}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
