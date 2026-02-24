/**
 * Скрипт проверки: создаёт тестового пользователя, тестовую новость и голос.
 * Запуск: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/verify-relations.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "test-verify@example.com";

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: "Тестовый пользователь",
    },
    update: {},
  });
  console.log("User:", user.id, user.email);

  const news = await prisma.news.create({
    data: {
      ownerId: user.id,
      title: "Тестовая новость",
      content: "Контент для проверки связей.",
      visibility: "PUBLIC",
    },
  });
  console.log("News:", news.id, news.title);

  const vote = await prisma.vote.upsert({
    where: {
      userId_newsId: { userId: user.id, newsId: news.id },
    },
    create: {
      userId: user.id,
      newsId: news.id,
      value: 1,
    },
    update: { value: 1 },
  });
  console.log("Vote:", vote.id, "value:", vote.value);

  console.log("OK: пользователь, новость и голос созданы.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
