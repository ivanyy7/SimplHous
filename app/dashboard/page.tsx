/**
 * Личный кабинет. Доступен только авторизованным (middleware + server-side проверка).
 * Пример получения сессии на сервере и стабильного userId.
 */
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  // Server-side проверка сессии: если по какой-то причине middleware пропустил
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const email = session.user.email ?? "—";
  const name = session.user.name ?? "—";

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Личный кабинет</h1>
        <p style={styles.subtitle}>Профиль и навигация</p>

        <div style={styles.section}>
          <p style={styles.label}>Имя</p>
          <p style={styles.value}>{name}</p>
        </div>
        <div style={styles.section}>
          <p style={styles.label}>Email</p>
          <p style={styles.value}>{email}</p>
        </div>
        <div style={styles.section}>
          <p style={styles.label}>UserId (стабильный id в БД)</p>
          <p style={styles.mono}>{userId}</p>
        </div>

        <nav style={styles.nav}>
          <Link href="/my-prompts" style={styles.link}>
            Мои промты →
          </Link>
          <Link href="/" style={styles.link}>
            На главную
          </Link>
        </nav>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          style={{ marginTop: "1.5rem" }}
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
    maxWidth: "560px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  title: { margin: "0 0 0.25rem", fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: "0 0 1.5rem", color: "#64748b", fontSize: "0.9rem" },
  section: { marginBottom: "1rem" },
  label: { margin: "0 0 0.25rem", fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase" },
  value: { margin: 0, fontSize: "1rem", color: "#0f172a" },
  mono: { margin: 0, fontSize: "0.85rem", fontFamily: "monospace", color: "#475569", wordBreak: "break-all" },
  nav: { display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: 500 },
  logout: {
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    color: "#64748b",
    background: "transparent",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
