# TARAZ EVENTS — Cloudflare Pages

Подготовлено из ZIP DesignArena. Исходный дизайн React сохранён, служебные скрипты записи DesignArena удалены.

## Публикация без сборки на ПК

1. Создайте **приватный** GitHub-репозиторий и загрузите содержимое этого архива **в корень** репозитория.
2. В Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git выберите репозиторий.
3. Build command: `npm run build`; Build output directory: `dist`; root directory: `/`. Production branch: `main`. Cloudflare выполнит сборку на своей стороне.
4. После Deploy появится URL на `*.pages.dev`.

**Не загружайте этот исходный ZIP через Direct Upload:** это исходный код Vite, а не папка `dist`. Для Direct Upload сначала нужна рабочая сборка `dist`.

## Данные и регистрация

Оригинальный ZIP содержал Vercel API `/api/events` и `/api/waitlist`, использующий Supabase без приложенных учётных данных. Эти API заменены на Cloudflare Pages Functions на тех же адресах.

Для реальной загрузки событий и регистрации в лист ожидания настройте в Cloudflare Pages → Settings → Variables and Secrets:

- `SUPABASE_URL` — URL **вашего** проекта Supabase (https://...supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY` — **секрет**, отметьте `Encrypt`, НИКОГДА не добавляйте в Git или Vite env.

Нужны таблицы `taraz_events` и `taraz_waitlist` со структурой исходного приложения (включая уникальный индекс email). Без этих настроек **лендинг публикуется**, но события и форма подписки будут показывать явную ошибку, а не сохранять данные. Если проект Supabase принадлежит DesignArena и его доступов нет, понадобится создать собственный проект и таблицы.

## Что проверить после публикации

- Открывается главная страница, изображения, мобильная адаптация и анимации
- `GET /api/events` возвращает данные после подключения Supabase
- `GET /api/waitlist` возвращает счётчик
- Отправка тестовой заявки в форму работает (только при подключённой БД)

Ни один секретный ключ не входит в ZIP.
