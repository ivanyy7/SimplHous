# Личный кабинет (Dashboard) — инструкция

## Требования

- **DATABASE_URL** в `.env` — строка подключения к PostgreSQL (NeonDB или локальный Postgres).
- Авторизация уже настроена (NextAuth): переменные `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` и т.д.

## Миграция БД

После добавления поля `is_favorite` в модель `Prompt` выполните миграцию:

```powershell
npx prisma migrate deploy
```

Или для разработки (создание миграции при изменении схемы):

```powershell
npx prisma migrate dev
```

Генерация клиента Prisma (обычно выполняется при `pnpm install` или `npm run build`):

```powershell
npx prisma generate
```

## Запуск

```powershell
pnpm install
pnpm run dev
```

Откройте в браузере: `http://localhost:3000/dashboard` (после входа в аккаунт).

## Проверка функциональности

1. **Создать News**  
   Войти → перейти в **Личный кабинет** (или `/dashboard`) → нажать «+ New News» → заполнить заголовок и текст, при необходимости включить «Публичный» → «Создать». В списке должна появиться новая карточка.

2. **Редактировать**  
   На карточке News нажать иконку карандаша → изменить заголовок/текст/публичность → «Сохранить». Изменения должны отобразиться в списке.

3. **Удалить**  
   На карточке нажать иконку корзины → подтвердить удаление. Карточка должна исчезнуть из списка.

4. **Переключить public/private**  
   На карточке нажать иконку глобуса (публичный) или замка (приватный). Публичные News появятся на странице «Публичные» (`/dashboard/public`).

5. **Избранное**  
   На карточке нажать звёздочку — News попадёт в «Избранное» (`/dashboard/favorites`). Повторное нажатие убирает из избранного.

6. **Поиск**  
   В поле поиска ввести часть заголовка или текста — список отфильтруется (с задержкой ~300 мс). Работает на страницах «Мои News», «Публичные», «Избранное».

7. **Пагинация**  
   Внизу списка — кнопки «Назад» / «Вперёд» и номер страницы (по 10 записей на страницу).

## Маршруты

| Путь | Описание |
|------|----------|
| `/dashboard` | Мои News (список, создание, редактирование, удаление) |
| `/dashboard/public` | Публичные News (все, где включена публичность) |
| `/dashboard/favorites` | Избранное (только свои, отмеченные звёздочкой) |
| `/dashboard/history` | История (заглушка «Скоро…») |
| `/dashboard/settings` | Настройки (заглушка «Скоро…») |

## Созданные/изменённые файлы

- `prisma/schema.prisma` — добавлено поле `isFavorite` у модели `Prompt`
- `prisma/migrations/20260226000000_add_prompt_is_favorite/migration.sql` — миграция
- `lib/validations/prompt.ts` — схемы zod для создания/обновления
- `app/dashboard/actions.ts` — server actions: createPrompt, updatePrompt, deletePrompt, togglePromptPublic, togglePromptFavorite, getMyPrompts, getPublicPrompts, getFavoritePrompts
- `app/dashboard/layout.tsx` — layout с сайдбаром и проверкой auth
- `app/dashboard/page.tsx` — страница «Мои News»
- `app/dashboard/public/page.tsx` — страница «Публичные News»
- `app/dashboard/favorites/page.tsx` — страница «Избранное»
- `app/dashboard/history/page.tsx` — заглушка «История»
- `app/dashboard/settings/page.tsx` — заглушка «Настройки»
- `components/dashboard/DashboardSidebar.tsx` — сайдбар с аватаром и навигацией
- `components/dashboard/PromptCard.tsx` — карточка News (иконки: избранное, публичность, редактировать, удалить)
- `components/dashboard/PromptDialog.tsx` — модальное окно создания/редактирования
- `components/dashboard/SearchInput.tsx` — поле поиска с debounce
- `components/dashboard/Pagination.tsx` — пагинация
- `components/dashboard/NewNewsButton.tsx` — кнопка «+ New News» и открытие диалога
- `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css` — Tailwind
- `package.json` — зависимости: lucide-react, zod, tailwindcss, postcss, autoprefixer
