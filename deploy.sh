#!/bin/bash

# Скрипт автоматического развертывания GardenFab
# Использование: ./deploy.sh [production|staging]

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция логирования
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Проверка аргументов
ENVIRONMENT=${1:-production}
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    error "Неверное окружение. Используйте 'production' или 'staging'"
fi

log "Начинаем развертывание в окружении: $ENVIRONMENT"

# Переменные
APP_DIR="/var/www/gardenfab"
BACKUP_DIR="/var/backups/gardenfab"
LOG_FILE="/var/log/gardenfab/deploy.log"

# Создание директорий если не существуют
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p /var/log/gardenfab
sudo mkdir -p /var/log/pm2

# Установка прав доступа
sudo chown -R gardenfab:gardenfab $APP_DIR
sudo chown -R gardenfab:gardenfab $BACKUP_DIR

# Переключение в директорию приложения
cd $APP_DIR || error "Не удалось перейти в директорию приложения"

# Создание резервной копии
log "Создание резервной копии..."
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
sudo -u postgres pg_dump gardenfab > "$BACKUP_DIR/db_$BACKUP_NAME.sql"
tar -czf "$BACKUP_DIR/app_$BACKUP_NAME.tar.gz" --exclude=node_modules --exclude=.git .

# Остановка приложения
log "Остановка приложения..."
pm2 stop gardenfab || warning "Приложение не было запущено"

# Обновление кода
log "Обновление кода из Git..."
git fetch origin
git reset --hard origin/main

# Установка зависимостей
log "Установка зависимостей..."
npm ci --only=production

# Генерация Prisma клиента
log "Генерация Prisma клиента..."
npx prisma generate

# Применение миграций
log "Применение миграций базы данных..."
npx prisma migrate deploy

# Сборка приложения
log "Сборка приложения..."
npm run build

# Запуск приложения
log "Запуск приложения..."
pm2 start ecosystem.config.js

# Сохранение конфигурации PM2
pm2 save

# Проверка статуса
log "Проверка статуса приложения..."
sleep 5
if pm2 list | grep -q "gardenfab.*online"; then
    log "Приложение успешно запущено"
else
    error "Ошибка запуска приложения"
fi

# Очистка старых резервных копий (старше 7 дней)
log "Очистка старых резервных копий..."
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# Проверка доступности
log "Проверка доступности приложения..."
sleep 10
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "Приложение доступно по адресу http://localhost:3000"
else
    warning "Приложение недоступно по адресу http://localhost:3000"
fi

# Перезагрузка Nginx
log "Перезагрузка Nginx..."
sudo systemctl reload nginx

log "Развертывание завершено успешно!"
log "Резервная копия сохранена: $BACKUP_DIR/app_$BACKUP_NAME.tar.gz"
log "Логи развертывания: $LOG_FILE"

# Вывод статуса
pm2 status
