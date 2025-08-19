#!/bin/bash

# Простой деплой на VPS для лендинга
# Минимальная настройка

SERVER_IP="31.31.198.90"
SERVER_USER="root"

echo "🚀 Простой деплой лендинга GardenFab на VPS..."

# Сборка проекта
echo "📦 Сборка проекта..."
npm run build:static

# Создание архива
echo "📁 Создание архива..."
tar -czf gardenfab-landing.tar.gz out/

# Загрузка на сервер
echo "⬆️ Загрузка на сервер..."
scp gardenfab-landing.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Настройка на сервере
echo "⚙️ Настройка на сервере..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
    # Установка Nginx (если не установлен)
    if ! command -v nginx &> /dev/null; then
        echo "Установка Nginx..."
        apt update
        apt install -y nginx
    fi
    
    # Создание директории сайта
    mkdir -p /var/www/gardenfab
    
    # Распаковка файлов
    cd /tmp
    tar -xzf gardenfab-landing.tar.gz
    cp -r out/* /var/www/gardenfab/
    
    # Настройка Nginx
    cat > /etc/nginx/sites-available/gardenfab << 'NGINX'
server {
    listen 80;
    server_name gardenfab.ru www.gardenfab.ru;
    
    root /var/www/gardenfab;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX
    
    # Активация сайта
    ln -sf /etc/nginx/sites-available/gardenfab /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Проверка и перезапуск Nginx
    nginx -t
    systemctl restart nginx
    
    # Очистка
    rm -f /tmp/gardenfab-landing.tar.gz
    rm -rf /tmp/out
    
    echo "✅ Лендинг успешно развернут!"
    echo "🌐 Доступен по адресу: http://gardenfab.ru"
EOF

# Очистка локальных файлов
rm -f gardenfab-landing.tar.gz
rm -rf out/

echo "🎉 Деплой завершен!"
echo "🌐 Ваш лендинг доступен по адресу: http://gardenfab.ru"
