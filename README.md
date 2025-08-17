# GARDENFAB — Садовая мебель на заказ

Современный веб-сайт для компании по производству садовой мебели на заказ, построенный на Next.js 15 с TypeScript.

## ✨ Особенности

- 🪑 **Садовая мебель** - Специализация на мебели для террас, патио и садов
- 🎨 **Современный дизайн** - Темная тема с золотыми акцентами
- 📱 **Адаптивный дизайн** - Оптимизирован для всех устройств
- 🚀 **Высокая производительность** - Next.js 15 с App Router
- 🔒 **Безопасность** - Валидация, rate limiting, CSP заголовки
- 📊 **Админ-панель** - Управление заявками и аналитика
- 🎭 **Анимации** - Framer Motion и GSAP
- 🗄️ **База данных** - PostgreSQL с Prisma ORM
- 🔍 **SEO оптимизация** - Мета-теги, sitemap, robots.txt

## 🛠️ Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion, GSAP
- **Database**: PostgreSQL + Prisma
- **Validation**: Zod
- **Deployment**: Vercel (рекомендуется)

## 🪑 Продукция

### Типы садовой мебели:
- **Угловые диваны** - Для террас и патио
- **Лежаки** - Комфортный отдых в саду
- **Скамейки** - Классические и современные
- **Столы** - Обеденные и журнальные
- **Стулья** - Для зон отдыха
- **Комплекты** - Готовые решения для веранд

### Материалы:
- **Качественная древесина**: Тик, акация (устойчивые к погодным условиям)
- **Металл**: Прочные каркасы и ножки
- **Ткани**: Водоотталкивающие материалы для подушек
- **Фурнитура**: Качественные крепления и соединения

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- PostgreSQL
- npm, yarn или pnpm

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/your-username/gardenfab.git
   cd gardenfab
   ```

2. **Установите зависимости**
   ```bash
   npm install
   # или
   yarn install
   # или
   pnpm install
   ```

3. **Настройте базу данных**
   ```bash
   # Создайте .env файл на основе .env.example
   cp .env.example .env
   
   # Настройте DATABASE_URL в .env
   DATABASE_URL="postgresql://username:password@localhost:5432/gardenfab"
   ```

4. **Запустите миграции**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Запустите сервер разработки**
   ```bash
   npm run dev
   ```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🔧 Конфигурация

### Переменные окружения

Создайте `.env` файл в корне проекта:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gardenfab"

# Security
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials
ADMIN_USER="admin"
ADMIN_PASS="secure-password"

# Google verification codes
GOOGLE_VERIFICATION="your-google-verification-code"
YANDEX_VERIFICATION="your-yandex-verification-code"

# Email service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Analytics
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
YANDEX_METRICA_ID="YOUR_YANDEX_ID"
```

### База данных

Проект использует PostgreSQL с Prisma ORM. Основные модели:

- **Lead** - Заявки от клиентов с полями: id, name, phone, message, status, createdAt, updatedAt

## 📁 Структура проекта

```
gardenfab/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Админ-панель
│   │   ├── api/            # API endpoints
│   │   ├── globals.css     # Глобальные стили
│   │   ├── layout.tsx      # Корневой layout
│   │   └── page.tsx        # Главная страница
│   ├── components/         # React компоненты
│   │   ├── About.tsx       # О компании
│   │   ├── Contact.tsx     # Форма обратной связи
│   │   ├── Footer.tsx      # Подвал
│   │   ├── Gallery.tsx     # Галерея работ
│   │   ├── Header.tsx      # Навигация
│   │   ├── Hero.tsx        # Главный экран
│   │   ├── Process.tsx     # Процесс работы
│   │   ├── Reviews.tsx     # Отзывы
│   │   └── ScrollProvider.tsx # Провайдер прокрутки
│   └── lib/                # Утилиты
│       └── prisma.ts       # Prisma клиент
├── prisma/                 # Схема базы данных
├── public/                 # Статические файлы
└── package.json            # Зависимости
```

## 🔒 Безопасность

### Реализованные меры

- ✅ Валидация данных на сервере (Zod)
- ✅ Rate limiting (5 запросов в 15 минут)
- ✅ Content Security Policy (CSP)
- ✅ Заголовки безопасности
- ✅ Защита от XSS и CSRF
- ✅ Валидация входных данных

### Рекомендации по безопасности

1. **Аутентификация админ-панели**
   - Реализуйте JWT токены или сессии
   - Добавьте двухфакторную аутентификацию

2. **Rate Limiting**
   - В продакшене используйте Redis для rate limiting
   - Настройте разные лимиты для разных endpoints

3. **Мониторинг**
   - Добавьте логирование всех действий
   - Настройте алерты при подозрительной активности

## 📊 Админ-панель

Доступна по адресу `/admin` с функциями:

- 📋 Просмотр всех заявок
- 🔄 Изменение статуса заявок
- 📈 Статистика по статусам
- 🔍 Фильтрация и поиск
- 📱 Адаптивный интерфейс

## 🚀 Деплой

### Vercel (рекомендуется)

1. Подключите GitHub репозиторий к Vercel
2. Настройте переменные окружения
3. Настройте PostgreSQL базу данных
4. Деплой автоматический при push в main

### Docker

```bash
# Сборка образа
docker build -t gardenfab .

# Запуск контейнера
docker run -p 3000:3000 gardenfab
```

### Ручной деплой

```bash
# Сборка
npm run build

# Запуск
npm start
```

## 📈 Производительность

### Оптимизации

- ✅ Next.js Image оптимизация
- ✅ Ленивая загрузка компонентов
- ✅ Оптимизация шрифтов
- ✅ Минификация CSS/JS
- ✅ Кэширование статических ресурсов

### Мониторинг

- Core Web Vitals
- Lighthouse score
- Bundle analyzer

## 🔍 SEO

### Реализовано

- ✅ Мета-теги для всех страниц
- ✅ Open Graph теги
- ✅ Twitter Cards
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Структурированные данные
- ✅ Canonical URLs

### Настройка

1. Обновите `metadataBase` в `layout.tsx`
2. Добавьте verification коды в `.env`
3. Настройте Google Search Console
4. Добавьте Yandex Webmaster

## 📧 Уведомления

### Планируемые улучшения

- [ ] Email уведомления о новых заявках
- [ ] Telegram бот для уведомлений
- [ ] SMS уведомления
- [ ] Автоматические напоминания

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Покрытие кода
npm run test:coverage

# E2E тесты
npm run test:e2e
```

## 📝 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

- **Email**: support@gardenfab.ru
- **Telegram**: [@gardenfab](https://t.me/gardenfab)
- **ВКонтакте**: [gardenfab](https://vk.com/gardenfab)
- **Город**: Воронеж
- **Документация**: [docs.gardenfab.ru](https://docs.gardenfab.ru)

## 🙏 Благодарности

- Next.js команде за отличный фреймворк
- Tailwind CSS за систему стилизации
- Prisma за современную ORM
- Framer Motion за анимации

---

**GARDENFAB** — Создаем садовую мебель вашей мечты! 🪑✨
