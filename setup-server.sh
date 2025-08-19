#!/bin/bash

# Скрипт первоначальной настройки VPS для GardenFab
# Выполнять от имени root

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

log "Начинаем первоначальную настройку VPS для GardenFab..."

# Обновление системы
log "Обновление системы..."
apt update && apt upgrade -y

# Установка необходимых пакетов
log "Установка необходимых пакетов..."
apt install -y curl wget git nginx postgresql postgresql-contrib ufw fail2ban

# Установка Node.js 18+
log "Установка Node.js 18+..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Проверка версий
log "Проверка установленных версий..."
node --version
npm --version
nginx -v

# Установка PM2
log "Установка PM2..."
npm install -g pm2

# Создание пользователя gardenfab
log "Создание пользователя gardenfab..."
if ! id "gardenfab" &>/dev/null; then
    adduser --disabled-password --gecos "" gardenfab
    usermod -aG sudo gardenfab
    log "Пользователь gardenfab создан"
else
    log "Пользователь gardenfab уже существует"
fi

# Настройка PostgreSQL
log "Настройка PostgreSQL..."
sudo -u postgres createuser --interactive --pwprompt gardenfab || warning "Пользователь PostgreSQL уже существует"
sudo -u postgres createdb gardenfab || warning "База данных уже существует"

# Создание директорий
log "Создание директорий..."
mkdir -p /var/www/gardenfab
mkdir -p /var/log/gardenfab
mkdir -p /var/backups/gardenfab
mkdir -p /var/log/pm2

# Настройка прав доступа
log "Настройка прав доступа..."
chown -R gardenfab:gardenfab /var/www/gardenfab
chown -R gardenfab:gardenfab /var/log/gardenfab
chown -R gardenfab:gardenfab /var/backups/gardenfab

# Настройка Nginx
log "Настройка Nginx..."
cp nginx-gardenfab.conf /etc/nginx/sites-available/gardenfab
ln -sf /etc/nginx/sites-available/gardenfab /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Настройка firewall
log "Настройка firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Настройка fail2ban
log "Настройка fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Перезапуск сервисов
log "Перезапуск сервисов..."
systemctl enable nginx
systemctl enable postgresql
systemctl restart nginx
systemctl restart postgresql

log "Первоначальная настройка VPS завершена!"
log "Теперь можно загружать проект и выполнять деплой"
