import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>SimplHous</h1>
      <p>
        <a href="/view-db">view-db</a> — просмотр таблиц и CRUD
      </p>
      <p>Данные из PostgreSQL (Neon):</p>
      {notes.length === 0 ? (
        <p>Заметок пока нет. Запустите seed: <code>npm run db:seed</code></p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                padding: "0.75rem",
                marginBottom: "0.5rem",
                background: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <strong>{note.title}</strong>
              <span style={{ color: "#666", marginLeft: "0.5rem" }}>
                {new Date(note.createdAt).toLocaleString("ru")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
