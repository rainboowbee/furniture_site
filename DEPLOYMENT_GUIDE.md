# Инструкция по развертыванию GardenFab на Ubuntu сервер

## Обзор проекта
Это Next.js приложение с базой данных PostgreSQL, использующее Prisma ORM.

## Предварительные требования
- Ubuntu сервер (рекомендуется 20.04 LTS или новее)
- Доступ по SSH
- Права sudo пользователя

## Шаг 1: Подготовка сервера

### 1.1 Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Установка необходимых пакетов
```bash
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### 1.3 Установка Node.js 18+ (рекомендуется LTS)
```bash
# Добавление официального репозитория NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Установка Node.js
sudo apt install -y nodejs

# Проверка версии
node --version
npm --version
```

### 1.4 Установка PostgreSQL
```bash
# Добавление официального репозитория PostgreSQL
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Обновление и установка
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Запуск и включение автозапуска
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Проверка статуса
sudo systemctl status postgresql
```

### 1.5 Установка Nginx
```bash
sudo apt install -y nginx

# Запуск и включение автозапуска
sudo systemctl start nginx
sudo systemctl enable nginx

# Проверка статуса
sudo systemctl status nginx
```

### 1.6 Установка PM2 (менеджер процессов)
```bash
sudo npm install -g pm2
```

## Шаг 2: Настройка базы данных

### 2.1 Создание пользователя и базы данных
```bash
# Переключение на пользователя postgres
sudo -u postgres psql

# В PostgreSQL консоли выполнить:
CREATE DATABASE gardenfab;
CREATE USER gardenfab_user WITH ENCRYPTED PASSWORD 'ваш_надежный_пароль';
GRANT ALL PRIVILEGES ON DATABASE gardenfab TO gardenfab_user;
ALTER USER gardenfab_user CREATEDB;
\q
```

### 2.2 Настройка PostgreSQL для внешних подключений
```bash
# Редактирование конфигурации
sudo nano /etc/postgresql/*/main/postgresql.conf

# Найти и изменить строку:
# listen_addresses = 'localhost'
# на:
listen_addresses = '*'

# Редактирование pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Добавить в конец файла:
host    all             all             0.0.0.0/0               md5

# Перезапуск PostgreSQL
sudo systemctl restart postgresql
```

## Шаг 3: Развертывание приложения

### 3.1 Создание пользователя для приложения
```bash
sudo adduser gardenfab
sudo usermod -aG sudo gardenfab
```

### 3.2 Создание директории для приложения
```bash
sudo mkdir -p /var/www/gardenfab
sudo chown gardenfab:gardenfab /var/www/gardenfab
```

### 3.3 Клонирование проекта
```bash
# Переключение на пользователя gardenfab
sudo su - gardenfab

# Клонирование проекта
cd /var/www/gardenfab
git clone https://github.com/ваш_username/gardenfab.git .

# Или загрузка через SCP/SFTP
# scp -r ./gardenfab user@server:/var/www/gardenfab/
```

### 3.4 Установка зависимостей
```bash
cd /var/www/gardenfab
npm install
```

### 3.5 Создание файла окружения
```bash
nano .env.local
```

Содержимое файла `.env.local`:
```env
DATABASE_URL="postgresql://gardenfab_user:ваш_надежный_пароль@localhost:5432/gardenfab"
NODE_ENV=production
NEXTAUTH_SECRET=ваш_секретный_ключ_для_аутентификации
NEXTAUTH_URL=https://ваш_домен.com
```

### 3.6 Генерация Prisma клиента и миграция БД
```bash
npx prisma generate
npx prisma migrate deploy
```

### 3.7 Сборка приложения
```bash
npm run build
```

## Шаг 4: Настройка PM2

### 4.1 Создание конфигурации PM2
```bash
nano ecosystem.config.js
```

Содержимое файла `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'gardenfab',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/gardenfab',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### 4.2 Запуск приложения через PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Шаг 5: Настройка Nginx

### 5.1 Создание конфигурации сайта
```bash
sudo nano /etc/nginx/sites-available/gardenfab
```

Содержимое файла:
```nginx
server {
    listen 80;
    server_name ваш_домен.com www.ваш_домен.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Оптимизация для статических файлов
    location /_next/static/ {
        alias /var/www/gardenfab/.next/static/;
        expires 365d;
        access_log off;
    }

    location /public/ {
        alias /var/www/gardenfab/public/;
        expires 30d;
        access_log off;
    }
}
```

### 5.2 Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/gardenfab /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Шаг 6: Настройка SSL (HTTPS)

### 6.1 Установка Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Получение SSL сертификата
```bash
sudo certbot --nginx -d ваш_домен.com -d www.ваш_домен.com
```

### 6.3 Автоматическое обновление сертификатов
```bash
sudo crontab -e

# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Шаг 7: Настройка файрвола

### 7.1 Настройка UFW
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432/tcp  # PostgreSQL (если нужен внешний доступ)
sudo ufw enable
sudo ufw status
```

## Шаг 8: Мониторинг и логи

### 8.1 Просмотр логов PM2
```bash
pm2 logs gardenfab
pm2 monit
```

### 8.2 Просмотр логов Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 8.3 Просмотр логов PostgreSQL
```bash
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## Шаг 9: Автоматическое обновление

### 9.1 Создание скрипта обновления
```bash
nano /var/www/gardenfab/update.sh
```

Содержимое скрипта:
```bash
#!/bin/bash
cd /var/www/gardenfab
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart gardenfab
```

### 9.2 Сделать скрипт исполняемым
```bash
chmod +x /var/www/gardenfab/update.sh
```

## Шаг 10: Резервное копирование

### 10.1 Создание скрипта резервного копирования БД
```bash
nano /var/www/gardenfab/backup.sh
```

Содержимое скрипта:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/gardenfab"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Резервное копирование базы данных
sudo -u postgres pg_dump gardenfab > $BACKUP_DIR/db_backup_$DATE.sql

# Резервное копирование файлов приложения
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/gardenfab

# Удаление старых резервных копий (старше 30 дней)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### 10.2 Настройка автоматического резервного копирования
```bash
chmod +x /var/www/gardenfab/backup.sh
sudo crontab -e

# Добавить строку для ежедневного резервного копирования в 2:00:
0 2 * * * /var/www/gardenfab/backup.sh
```

## Проверка работоспособности

### Проверка статуса сервисов
```bash
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status
```

### Проверка доступности сайта
```bash
curl -I http://localhost
curl -I https://ваш_домен.com
```

## Полезные команды

### Перезапуск всех сервисов
```bash
sudo systemctl restart nginx
sudo systemctl restart postgresql
pm2 restart all
```

### Просмотр использования ресурсов
```bash
htop
df -h
free -h
```

### Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

## Устранение неполадок

### Если приложение не запускается
```bash
pm2 logs gardenfab
pm2 restart gardenfab
```

### Если база данных недоступна
```bash
sudo systemctl status postgresql
sudo systemctl restart postgresql
```

### Если Nginx не работает
```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx
```

## Безопасность

- Регулярно обновляйте систему
- Используйте надежные пароли
- Ограничьте доступ к SSH только с определенных IP
- Регулярно проверяйте логи на подозрительную активность
- Настройте fail2ban для защиты от брутфорс атак

## Контакты для поддержки

При возникновении проблем проверьте:
1. Логи приложения: `pm2 logs gardenfab`
2. Логи Nginx: `/var/log/nginx/error.log`
3. Логи PostgreSQL: `/var/log/postgresql/`
4. Статус сервисов: `sudo systemctl status [service_name]`
