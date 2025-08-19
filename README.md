# GardenFab - Лендинг

Современный лендинг для компании GardenFab, созданный с использованием Next.js 15 и Tailwind CSS.

## Технологии

- **Next.js 15** - React фреймворк
- **Tailwind CSS** - CSS фреймворк
- **TypeScript** - типизированный JavaScript
- **Framer Motion** - анимации
- **GSAP** - продвинутые анимации
- **Locomotive Scroll** - плавная прокрутка

## Разработка

   ```bash
# Установка зависимостей
   npm install

# Запуск в режиме разработки
   npm run dev

# Сборка для продакшена
npm run build

# Сборка статической версии
npm run build:static
```

## Деплой

Для деплоя используйте скрипт `deploy-on-server.sh`:

```bash
chmod +x deploy-on-server.sh
./deploy-on-server.sh
```

## Структура проекта

```
src/
├── app/           # Страницы приложения
├── components/    # React компоненты
├── lib/          # Утилиты и хелперы
└── styles/       # Глобальные стили
```

## Лицензия

Приватный проект GardenFab
