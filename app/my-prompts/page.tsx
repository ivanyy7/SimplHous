/**
 * Мои новости. Только новости текущего пользователя.
 * Пример server-side: получаем session, затем запрос в БД по ownerId.
 */
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MyNewsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Все новости текущего пользователя
  const news = await prisma.news.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Мои новости</h1>
        <p style={styles.subtitle}>Новости видны только вам</p>

        {news.length === 0 ? (
          <p style={styles.empty}>Новостей пока нет. Создайте первую в личном кабинете.</p>
        ) : (
          <ul style={styles.list}>
            {news.map((n) => (
              <li key={n.id} style={styles.item}>
                <strong>{n.title}</strong>
                <span style={styles.badge}>{n.visibility}</span>
                <span style={styles.date}>
                  {new Date(p.updatedAt).toLocaleDateString("ru")}
                </span>
              </li>
            ))}
          </ul>
        )}

        <nav style={styles.nav}>
          <Link href="/dashboard" style={styles.link}>
            ← В кабинет
          </Link>
        </nav>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          style={{ marginTop: "1rem" }}
        >
          <button type="submit" style={styles.logout}>
            Выйти
          </button>
        </form>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    padding: "2rem",
    background: "#f8fafc",
  },
  card: {
    maxWidth: "640px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  title: { margin: "0 0 0.25rem", fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: "0 0 1.5rem", color: "#64748b", fontSize: "0.9rem" },
  empty: { color: "#64748b", margin: "1rem 0" },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    background: "#f8fafc",
    borderRadius: "8px",
  },
  badge: {
    fontSize: "0.75rem",
    padding: "0.2rem 0.5rem",
    background: "#e2e8f0",
    borderRadius: "4px",
    color: "#475569",
  },
  date: { marginLeft: "auto", fontSize: "0.85rem", color: "#64748b" },
  nav: { marginTop: "1.5rem" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: 500 },
  logout: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    color: "#64748b",
    background: "transparent",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
