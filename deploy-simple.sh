#!/bin/bash

# Простой деплой лендинга GardenFab
# Для статического хостинга

echo "🚀 Сборка статического лендинга..."

# Сборка проекта
npm run build:static

# Создание архива для загрузки
echo "📦 Создание архива..."
tar -czf gardenfab-landing.tar.gz out/

echo "✅ Готово! Загрузите файл gardenfab-landing.tar.gz на ваш хостинг"
echo "📁 Распакуйте архив в корневую папку сайта"
echo "🌐 Ваш лендинг будет доступен по адресу: https://gardenfab.ru"
