# Настройка аутентификации (Auth.js + Google OAuth)

Выполните эти шаги, чтобы получить **Client ID**, **Client Secret** и **AUTH_SECRET**, затем запишите их в `.env`.

---

## 1. AUTH_SECRET (секрет для сессий Auth.js)

Сгенерировать случайный секрет:

```powershell
npx auth secret
```

Скопируйте вывод и в `.env` добавьте (или замените):

```
AUTH_SECRET="скопированная-строка"
```

Секрет должен быть не короче 32 символов.

---

## 2. Google Client ID и Client Secret

### 2.1. Открыть Google Cloud Console

- Перейдите: **https://console.cloud.google.com/apis/credentials**
- Войдите в Google-аккаунт и выберите проект (или создайте новый).

### 2.2. Включить Google+ API / People API (если нужно)

- В меню слева: **APIs & Services** → **Library**.
- Найдите **Google+ API** или **People API** и включите для проекта.

### 2.3. Создать OAuth 2.0 Client ID

1. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
2. **Application type**: **Web application**.
3. **Name**: например `ProStore` или `SimplHous`.
4. **Authorized redirect URIs** — добавьте:
   - Локально: `http://localhost:3000/api/auth/callback/google`
   - Продакшен (если уже есть домен): `https://ваш-домен.vercel.app/api/auth/callback/google`
5. Нажмите **Create**. В диалоге появятся **Client ID** и **Client Secret**.

### 2.4. Записать в .env

В файл `.env` добавьте (подставьте свои значения):

```
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"
```

---

## 3. Итоговый вид .env

В `.env` должны быть (остальное по необходимости):

```
DATABASE_URL="postgresql://..."
AUTH_SECRET="значение из npx auth secret"
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
```

После сохранения `.env` перезапустите dev-сервер (`pnpm dev`) и проверьте вход через **Войти через Google** на `/login`.

---

## Чек-лист выполнения

- [ ] Выполнить в терминале: `npx auth secret` → скопировать вывод в `AUTH_SECRET` в `.env`
- [ ] Открыть [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
- [ ] Создать OAuth 2.0 Client ID (Web application), добавить redirect URI `http://localhost:3000/api/auth/callback/google`
- [ ] Вставить Client ID и Client Secret в `.env` в `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`
- [ ] Сохранить `.env` и перезапустить `pnpm dev`
