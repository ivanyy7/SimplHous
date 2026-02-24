import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getViewDbClient,
  getDelegate,
  VIEW_DB_TABLES,
  type ViewDbTableName,
} from "@/lib/view-db-client";

function parseTableName(name: string): ViewDbTableName | null {
  const cap = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return VIEW_DB_TABLES.includes(cap as ViewDbTableName) ? (cap as ViewDbTableName) : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ name: string; id: string }> }
) {
  const { name, id } = await params;
  const table = parseTableName(name);
  if (!table) return Response.json({ error: "Unknown table" }, { status: 400 });

  const db = (req.nextUrl.searchParams.get("db") || "local") as "local" | "work";
  const body = await req.json().catch(() => ({}));
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const data = { ...body };
  delete data.id;

  const client = getViewDbClient(db, prisma);
  const delegate = getDelegate(client, table);

  try {
    const updated = await delegate.update({ where: { id }, data });
    return Response.json(updated);
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string; id: string }> }
) {
  const { name, id } = await params;
  const table = parseTableName(name);
  if (!table) return Response.json({ error: "Unknown table" }, { status: 400 });

  const db = (_req.nextUrl.searchParams.get("db") || "local") as "local" | "work";
  const client = getViewDbClient(db, prisma);
  const delegate = getDelegate(client, table);

  try {
    await delegate.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 400 });
  }
}
