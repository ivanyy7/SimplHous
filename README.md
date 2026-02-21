# SimplHous
Сервис по обмену новостями/записями о вакантном жилье комнаты/квартиры/дома от собственников с актуальной датой выставления лота сдачи в аренду (оставлять могут только собственники, отдельно будет база риелторов по недвижимости).

## Стек
Next.js (App Router, TypeScript), Prisma, NeonDB (PostgreSQL), Vercel.

## Локальный запуск (PowerShell)

```powershell
# 1. Установка зависимостей
npm install

# 2. Настройка .env
copy .env.example .env
# Отредактировать .env — вставить DATABASE_URL из панели Neon.

# 3. Миграция БД (применить схему)
npx prisma migrate deploy

# 4. Seed (опционально)
npm run db:seed

# 5. Запуск
npm run dev
```

Открыть http://localhost:3000 — главная страница читает заметки из PostgreSQL.

## Деплой на Vercel

1. Импорт репозитория в Vercel.
2. **Environment Variables**: добавить `DATABASE_URL` (connection string из Neon, для serverless лучше с `?sslmode=require` и при необходимости пул).
3. В **Build Command** оставить `npm run build` (уже вызывает `prisma generate`).
4. Перед первым деплоем выполнить миграции к своей БД (локально или в Neon SQL):  
   `npx prisma migrate deploy` — или добавить в Vercel Build: `prisma generate && prisma migrate deploy && next build`, тогда миграции применятся при каждом билде.
5. Деплой — после успешного билда главная страница будет отдавать данные из Neon.
