import { NextRequest } from "next/server";
import { VIEW_DB_TABLES } from "@/lib/view-db-client";

export async function GET(req: NextRequest) {
  const db = (req.nextUrl.searchParams.get("db") || "local") as "local" | "work";
  return Response.json({
    db,
    tables: [...VIEW_DB_TABLES],
    workAvailable: !!process.env.DATABASE_URL_WORK,
  });
}
