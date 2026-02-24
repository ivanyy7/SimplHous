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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const table = parseTableName(name);
  if (!table) return Response.json({ error: "Unknown table" }, { status: 400 });

  const db = (req.nextUrl.searchParams.get("db") || "local") as "local" | "work";
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "10", 10)));
  const skip = (page - 1) * limit;

  const client = getViewDbClient(db, prisma);
  const delegate = getDelegate(client, table);

  const orderBy =
    table === "Category"
      ? ({ category: "asc" } as never)
      : table === "Tag"
        ? ({ name: "asc" } as never)
        : ({ createdAt: "desc" } as never);

  const [rows, total] = await Promise.all([
    delegate.findMany({ skip, take: limit, orderBy }),
    delegate.count(),
  ]);

  return Response.json({
    table,
    rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const table = parseTableName(name);
  if (!table) return Response.json({ error: "Unknown table" }, { status: 400 });

  const db = (req.nextUrl.searchParams.get("db") || "local") as "local" | "work";
  const body = await req.json().catch(() => ({}));
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const client = getViewDbClient(db, prisma);
  const delegate = getDelegate(client, table);

  const data = { ...body };
  delete data.id;

  try {
    const created = await delegate.create({ data });
    return Response.json(created);
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 400 });
  }
}
