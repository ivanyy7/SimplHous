# Что есть в системе (сущности):

- **Note** — заметки
- **User** — владелец новостей, автор, голосующий
- **News** — сама новость (может быть приватной или публичной)
- **Tag** — метки (многие-ко-многим с News)
- **Vote** — голос пользователя за публичную новость (уникально: один пользователь → один голос на новость)
- (опционально) **Collection / Folder** — папки/коллекции для организации
- (опционально) **NewsVersion** — версии новости (история изменений)

## Ключевые правила

- **Публичность** — это свойство News (visibility)
- Голосовать можно только по публичным (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
- Голос уникален: (userId, newsId) — уникальный индекс

## Схема базы данных

- **Note:** id, ownerId → User, title, createdAt
- **User:** id (cuid), email unique, name optional, createdAt
- **News:** id, ownerId → User, title, content, description optional, categoryId → Category, visibility (PRIVATE|PUBLIC, default PRIVATE), createdAt, updatedAt, publishedAt nullable
- **Vote:** id, userId → User, newsId → News, value int default 1, createdAt
- **Category:** id, category

- **Ограничение:** один пользователь может проголосовать за новость только один раз: UNIQUE(userId, newsId)

- **Индексы:**
  - News(ownerId, updatedAt)
  - News(visibility, createdAt)
  - Vote(newsId)
  - Vote(userId)

- **onDelete: Cascade** для связей
