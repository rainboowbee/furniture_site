#!/bin/bash

# Скрипт загрузки проекта GardenFab на VPS
# Выполнять из локальной директории проекта

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Проверка наличия SSH ключа
if [ ! -f ~/.ssh/id_rsa ]; then
    error "SSH ключ не найден. Создайте его командой: ssh-keygen -t rsa -b 4096"
fi

# Переменные (измените на ваши)
SERVER_IP="31.31.198.90"
SERVER_USER="gardenfab"
PROJECT_DIR="/var/www/gardenfab"

log "Начинаем загрузку проекта GardenFab на сервер $SERVER_IP..."

# Проверка подключения к серверу
log "Проверка подключения к серверу..."
ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo 'Подключение успешно'" || error "Не удается подключиться к серверу"

# Создание архива проекта (исключая node_modules и .git)
log "Создание архива проекта..."
tar --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='dist' -czf gardenfab-project.tar.gz .

# Загрузка архива на сервер
log "Загрузка архива на сервер..."
scp gardenfab-project.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Распаковка и настройка на сервере
log "Распаковка и настройка на сервере..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
    cd /tmp
    tar -xzf gardenfab-project.tar.gz -C /var/www/gardenfab --strip-components=0
    
    # Установка зависимостей
    cd /var/www/gardenfab
    npm ci --only=production
    
    # Генерация Prisma клиента
    npx prisma generate
    
    # Сборка приложения
    npm run build
    
    # Настройка прав доступа
    sudo chown -R gardenfab:gardenfab /var/www/gardenfab
    
    # Очистка временных файлов
    rm -f /tmp/gardenfab-project.tar.gz
EOF

# Очистка локального архива
rm -f gardenfab-project.tar.gz

log "Проект успешно загружен на сервер!"
log "Теперь можно выполнить деплой командой: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && ./deploy.sh'"
