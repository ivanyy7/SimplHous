"use client";

import { useState, useEffect, useCallback } from "react";

type DbType = "local" | "work";
type TableName = string;

export default function ViewDbPage() {
  const [db, setDb] = useState<DbType>("local");
  const [tables, setTables] = useState<TableName[]>([]);
  const [workAvailable, setWorkAvailable] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableName | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [formJson, setFormJson] = useState("");

  const limit = 10;
  const q = (key: string, v: string) => `${key}=${encodeURIComponent(v)}`;

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/view-db/tables?${q("db", db)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch tables");
      setTables(data.tables || []);
      setWorkAvailable(!!data.workAvailable);
    } catch (e) {
      setError(String(e));
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const fetchTable = useCallback(
    async (table: TableName, p: number) => {
      if (!table) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/view-db/table/${table}?${q("db", db)}&page=${p}&limit=${limit}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch table");
        setRows(data.rows || []);
        setTotalPages(data.totalPages || 0);
        setTotal(data.total ?? 0);
        setPage(p);
      } catch (e) {
        setError(String(e));
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [db]
  );

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    if (selectedTable) fetchTable(selectedTable, 1);
  }, [selectedTable, db]);

  const openTable = (table: TableName) => {
    setSelectedTable(table);
    setPage(1);
  };

  const refreshTable = () => {
    if (selectedTable) fetchTable(selectedTable, page);
  };

  const handleDelete = async (table: TableName, id: string) => {
    if (!confirm("Удалить запись?")) return;
    try {
      const res = await fetch(
        `/api/view-db/table/${table}/${id}?${q("db", db)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      refreshTable();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleCreate = async () => {
    try {
      const data = JSON.parse(formJson);
      const res = await fetch(`/api/view-db/table/${selectedTable!}?${q("db", db)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Create failed");
      }
      setModal(null);
      setFormJson("");
      refreshTable();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleUpdate = async () => {
    if (!editRow || typeof editRow.id !== "string") return;
    try {
      const data = { ...JSON.parse(formJson) };
      delete data.id;
      const res = await fetch(
        `/api/view-db/table/${selectedTable!}/${editRow.id}?${q("db", db)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Update failed");
      }
      setModal(null);
      setEditRow(null);
      setFormJson("");
      refreshTable();
    } catch (e) {
      setError(String(e));
    }
  };

  const columns =
    rows.length > 0
      ? Object.keys(rows[0] as object).filter((k) => typeof (rows[0] as Record<string, unknown>)[k] !== "object")
      : [];

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>view-db</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <label>
          БД:{" "}
          <select
            value={db}
            onChange={(e) => {
              setDb(e.target.value as DbType);
              setSelectedTable(null);
            }}
          >
            <option value="local">Локальная</option>
            <option value="work" disabled={!workAvailable}>
              Рабочая {!workAvailable && "(DATABASE_URL_WORK не задан)"}
            </option>
          </select>
        </label>
      </section>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
      )}

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Таблицы</h2>
        {loading && !selectedTable ? (
          <p>Загрузка…</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {tables.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => openTable(t)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: selectedTable === t ? "#333" : "#eee",
                    color: selectedTable === t ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
                <button
                  type="button"
                  onClick={() => openTable(t)}
                  style={{
                    marginLeft: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.85rem",
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Открыть
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedTable && (
        <section>
          <h2>{selectedTable}</h2>
          <div style={{ marginBottom: "0.5rem" }}>
            <button
              type="button"
              onClick={() => {
                setEditRow(null);
                setFormJson("{}");
                setModal("add");
              }}
              style={{
                padding: "0.4rem 0.8rem",
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Добавить
            </button>
          </div>

          {loading ? (
            <p>Загрузка…</p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #ddd" }}>
                      {columns.map((col) => (
                        <th key={col} style={{ textAlign: "left", padding: "0.5rem" }}>
                          {col}
                        </th>
                      ))}
                      <th style={{ width: "120px" }} />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={(row.id as string) ?? i} style={{ borderBottom: "1px solid #eee" }}>
                        {columns.map((col) => (
                          <td key={col} style={{ padding: "0.5rem" }}>
                            {String(
                              (row[col] instanceof Date
                                ? (row[col] as Date).toISOString()
                                : row[col]) ?? ""
                            )}
                          </td>
                        ))}
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setEditRow(row as Record<string, unknown>);
                              setFormJson(JSON.stringify(row, null, 2));
                              setModal("edit");
                            }}
                            style={{
                              marginRight: "0.25rem",
                              padding: "0.2rem 0.5rem",
                              fontSize: "0.8rem",
                              background: "#f59e0b",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Изменить
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(selectedTable, String(row.id))
                            }
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "0.8rem",
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => fetchTable(selectedTable, page - 1)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Назад
                </button>
                <span>
                  Страница {page} из {totalPages || 1} (всего записей: {total})
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => fetchTable(selectedTable, page + 1)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Вперёд
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setModal(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modal === "add" ? "Добавить запись" : "Изменить запись"}</h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              JSON (поля таблицы). Для создания не указывайте id.
            </p>
            <textarea
              value={formJson}
              onChange={(e) => setFormJson(e.target.value)}
              rows={12}
              style={{ width: "100%", fontFamily: "monospace", fontSize: "12px" }}
              spellCheck={false}
            />
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={modal === "add" ? handleCreate : handleUpdate}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {modal === "add" ? "Создать" : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={() => setModal(null)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
