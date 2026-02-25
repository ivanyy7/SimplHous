/**
 * Страница входа. Кнопка «Войти через Google».
 * Если пользователь уже авторизован — редирект в личный кабинет (/dashboard).
 */
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>SimplHous</h1>
        <p style={styles.subtitle}>Войдите, чтобы управлять промтами</p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button type="submit" style={styles.button}>
            Войти через Google
          </button>
        </form>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "2.5rem",
    maxWidth: "380px",
    width: "100%",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#1a1a2e",
  },
  subtitle: {
    margin: "0 0 1.5rem",
    color: "#64748b",
    fontSize: "0.95rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem 1.25rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    background: "#4285f4",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
