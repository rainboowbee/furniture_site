# Руководство по развертыванию GardenFab на VPS

## Предварительные требования

1. **VPS сервер** с Ubuntu 20.04+ или Debian 11+
2. **Домен** gardenfab.ru (уже настроен)
3. **SSH доступ** к серверу
4. **Git** на локальной машине

## Шаг 1: Подключение к серверу

```bash
ssh root@31.31.198.90
```

## Шаг 2: Первоначальная настройка сервера

Скопируйте файл `setup-server.sh` на сервер и выполните:

```bash
# На сервере
chmod +x setup-server.sh
./setup-server.sh
```

Этот скрипт установит:
- Node.js 18+
- Nginx
- PostgreSQL
- PM2
- UFW firewall
- Fail2ban
- Создаст пользователя gardenfab

## Шаг 3: Настройка SSH ключей

На локальной машине:

```bash
# Генерация SSH ключа (если нет)
ssh-keygen -t rsa -b 4096

# Копирование ключа на сервер
ssh-copy-id gardenfab@31.31.198.90
```

## Шаг 4: Загрузка проекта

На локальной машине в директории проекта:

```bash
chmod +x upload-project.sh
./upload-project.sh
```

## Шаг 5: Настройка переменных окружения

На сервере создайте файл `.env`:

```bash
ssh gardenfab@31.31.198.90
cd /var/www/gardenfab

# Создание .env файла
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://gardenfab:ваш_пароль@localhost:5432/gardenfab"
NEXTAUTH_SECRET="ваш_секретный_ключ"
NEXTAUTH_URL="https://gardenfab.ru"
NEXT_PUBLIC_SITE_URL="https://gardenfab.ru"
EOF
```

## Шаг 6: Настройка базы данных

```bash
# Подключение к PostgreSQL
sudo -u postgres psql

# Создание пользователя и базы (если не созданы)
CREATE USER gardenfab WITH PASSWORD 'ваш_пароль';
CREATE DATABASE gardenfab OWNER gardenfab;
GRANT ALL PRIVILEGES ON DATABASE gardenfab TO gardenfab;
\q

# Применение миграций
cd /var/www/gardenfab
npx prisma migrate deploy
```

## Шаг 7: Запуск приложения

```bash
cd /var/www/gardenfab
chmod +x deploy.sh
./deploy.sh
```

## Шаг 8: Настройка SSL (HTTPS)

Установите Certbot для Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d gardenfab.ru -d www.gardenfab.ru
```

## Шаг 9: Проверка работы

1. **Проверка приложения**: http://gardenfab.ru
2. **Проверка логов**: `pm2 logs gardenfab`
3. **Проверка статуса**: `pm2 status`
4. **Проверка Nginx**: `sudo systemctl status nginx`

## Структура директорий на сервере

```
/var/www/gardenfab/          # Основная директория проекта
/var/log/gardenfab/          # Логи приложения
/var/log/nginx/              # Логи Nginx
/var/backups/gardenfab/      # Резервные копии
/var/log/pm2/                # Логи PM2
```

## Управление приложением

```bash
# Статус приложения
pm2 status

# Перезапуск
pm2 restart gardenfab

# Остановка
pm2 stop gardenfab

# Логи
pm2 logs gardenfab

# Мониторинг
pm2 monit
```

## Обновление приложения

```bash
# На локальной машине
./upload-project.sh

# На сервере
cd /var/www/gardenfab
./deploy.sh
```

## Резервное копирование

```bash
# База данных
sudo -u postgres pg_dump gardenfab > backup_$(date +%Y%m%d).sql

# Файлы приложения
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/gardenfab
```

## Мониторинг и логи

- **PM2 логи**: `/var/log/pm2/`
- **Nginx логи**: `/var/log/nginx/`
- **Логи приложения**: `/var/log/gardenfab/`
- **Системные логи**: `journalctl -u nginx`, `journalctl -u postgresql`

## Безопасность

- UFW firewall настроен
- Fail2ban защищает от брутфорс атак
- SSH доступ только по ключам
- Nginx с базовыми заголовками безопасности

## Устранение неполадок

### Приложение не запускается
```bash
pm2 logs gardenfab
sudo journalctl -u nginx
```

### Проблемы с базой данных
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

### Проблемы с Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
```

## Контакты для поддержки

При возникновении проблем проверьте:
1. Логи приложения
2. Логи Nginx
3. Статус сервисов
4. Права доступа к файлам
5. Настройки firewall
