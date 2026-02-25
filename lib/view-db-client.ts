import { PrismaClient } from "@prisma/client";

const globalForWorkPrisma = globalThis as unknown as { workPrisma?: PrismaClient };

function getWorkPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL_WORK;
  if (!url) return new PrismaClient({ log: ["error"] });
  if (globalForWorkPrisma.workPrisma) return globalForWorkPrisma.workPrisma;
  const client = new PrismaClient({
    datasources: { db: { url } },
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") globalForWorkPrisma.workPrisma = client;
  return client;
}

export type DbType = "local" | "work";

export function getViewDbClient(db: DbType, prismaLocal: PrismaClient): PrismaClient {
  return db === "work" ? getWorkPrisma() : prismaLocal;
}

export const VIEW_DB_TABLES = ["User", "Note", "Category", "News", "Vote", "Tag"] as const;
export type ViewDbTableName = (typeof VIEW_DB_TABLES)[number];

const delegateKey: Record<ViewDbTableName, keyof PrismaClient> = {
  User: "user",
  Note: "note",
  Category: "category",
  News: "news",
  Vote: "vote",
  Tag: "tag",
};

export type TableDelegate = {
  findMany: (args: { skip?: number; take?: number; orderBy?: unknown }) => Promise<unknown[]>;
  findUnique: (args: { where: { id: string } }) => Promise<unknown | null>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
  count: () => Promise<number>;
};

export function getDelegate(client: PrismaClient, table: ViewDbTableName): TableDelegate {
  return client[delegateKey[table]] as unknown as TableDelegate;
}
