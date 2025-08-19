#!/bin/bash

# Деплой лендинга прямо на сервере
# Выполнять на сервере в директории проекта

echo "🚀 Деплой лендинга GardenFab на сервере..."

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Устанавливаем..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Проверка версий
echo "📋 Версии:"
node --version
npm --version

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build:static

# Проверка наличия папки out (Next.js 15 создает out при output: 'export')
if [ ! -d "out" ]; then
    echo "❌ Папка out не создана. Проверяем ошибки сборки..."
    echo "📁 Содержимое текущей директории:"
    ls -la
    exit 1
fi

# Создание директории сайта
echo "📁 Создание директории сайта..."
mkdir -p /var/www/gardenfab

# Копирование файлов
echo "📋 Копирование файлов..."
cp -r out/* /var/www/gardenfab/

# Установка Nginx (если не установлен)
if ! command -v nginx &> /dev/null; then
    echo "🌐 Установка Nginx..."
    apt update
    apt install -y nginx
fi

# Настройка Nginx
echo "⚙️ Настройка Nginx..."
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
    
    # Логи
    access_log /var/log/nginx/gardenfab_access.log;
    error_log /var/log/nginx/gardenfab_error.log;
}
NGINX

# Активация сайта
echo "🔗 Активация сайта..."
ln -sf /etc/nginx/sites-available/gardenfab /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации Nginx
echo "✅ Проверка конфигурации Nginx..."
nginx -t

# Перезапуск Nginx
echo "🔄 Перезапуск Nginx..."
systemctl restart nginx

# Настройка автозапуска
systemctl enable nginx

# Очистка временных файлов
echo "🧹 Очистка временных файлов..."
rm -rf out/

echo "🎉 Деплой завершен!"
echo "🌐 Ваш лендинг доступен по адресу: http://gardenfab.ru"
echo "📊 Статус Nginx: $(systemctl is-active nginx)"
echo "📁 Файлы сайта: /var/www/gardenfab/"
