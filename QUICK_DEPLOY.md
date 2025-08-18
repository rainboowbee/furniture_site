# Быстрое развертывание GardenFab на Ubuntu

## 🚀 Экспресс-развертывание (5 минут)

### 1. Подключение к серверу
```bash
ssh user@ваш_сервер_ip
```

### 2. Выполнение автоматического скрипта

#### 2.1 Скачивание скрипта развертывания
```bash
# Переходим в домашнюю директорию
cd ~

# Скачиваем скрипт развертывания
curl -O https://raw.githubusercontent.com/ваш_username/gardenfab/main/deploy.sh

# Проверяем, что файл скачался
ls -la deploy.sh
```

**Альтернативные способы получения скрипта:**

**Вариант A: Через Git (если проект уже в репозитории)**
```bash
# Клонируем весь проект
git clone https://github.com/ваш_username/gardenfab.git
cd gardenfab

# Копируем скрипт в удобное место
cp deploy.sh ~/
cd ~
```

**Вариант B: Через SCP (если скрипт на локальном компьютере)**
```bash
# На локальном компьютере выполнить:
scp deploy.sh user@ваш_сервер_ip:~/

# На сервере проверить:
ls -la ~/deploy.sh
```

**Вариант C: Создание скрипта вручную**
```bash
# Создаем файл
nano deploy.sh

# Вставляем содержимое скрипта (скопировать из файла deploy.sh)
# Сохраняем: Ctrl+X, затем Y, затем Enter
```

#### 2.2 Проверка содержимого скрипта
```bash
# Просматриваем первые строки скрипта
head -20 deploy.sh

# Проверяем, что это bash скрипт
file deploy.sh

# Смотрим права доступа
ls -la deploy.sh
```

#### 2.3 Настройка прав доступа
```bash
# Делаем скрипт исполняемым
chmod +x deploy.sh

# Проверяем права
ls -la deploy.sh
# Должно показать: -rwxr-xr-x (x означает исполняемый)
```

#### 2.4 Предварительная проверка системы
```bash
# Проверяем наличие необходимых пакетов
which node
which npm
which git
which nginx

# Если чего-то нет, устанавливаем
sudo apt update
sudo apt install -y nodejs npm git nginx postgresql postgresql-contrib

# Проверяем версии
node --version
npm --version
```

#### 2.5 Создание необходимых директорий
```bash
# Создаем директории для приложения
sudo mkdir -p /var/www/gardenfab
sudo mkdir -p /var/backups/gardenfab
sudo mkdir -p /var/log/gardenfab
sudo mkdir -p /var/log/pm2

# Создаем пользователя для приложения (если не существует)
sudo adduser --disabled-password --gecos "" gardenfab || echo "Пользователь уже существует"

# Устанавливаем права доступа
sudo chown -R gardenfab:gardenfab /var/www/gardenfab
sudo chown -R gardenfab:gardenfab /var/backups/gardenfab
sudo chown -R gardenfab:gardenfab /var/log/gardenfab
sudo chown -R gardenfab:gardenfab /var/log/pm2
```

#### 2.6 Настройка базы данных
```bash
# Переключаемся на пользователя postgres
sudo -u postgres psql

# В PostgreSQL консоли выполняем:
CREATE DATABASE gardenfab;
CREATE USER gardenfab_user WITH ENCRYPTED PASSWORD 'ваш_надежный_пароль';
GRANT ALL PRIVILEGES ON DATABASE gardenfab TO gardenfab_user;
ALTER USER gardenfab_user CREATEDB;
\q

# Проверяем, что база создалась
sudo -u postgres psql -l | grep gardenfab
```

#### 2.7 Запуск скрипта развертывания
```bash
# Запускаем скрипт в production режиме
./deploy.sh production

# Или в staging режиме (для тестирования)
# ./deploy.sh staging
```

**Что происходит во время выполнения скрипта:**
1. ✅ Создание резервной копии текущего состояния
2. ✅ Остановка приложения (если запущено)
3. ✅ Обновление кода из Git репозитория
4. ✅ Установка зависимостей
5. ✅ Генерация Prisma клиента
6. ✅ Применение миграций базы данных
7. ✅ Сборка приложения
8. ✅ Запуск через PM2
9. ✅ Проверка работоспособности
10. ✅ Перезагрузка Nginx

#### 2.8 Мониторинг процесса развертывания
```bash
# В отдельном терминале следим за логами
pm2 logs gardenfab

# Или мониторим все процессы
pm2 monit

# Проверяем статус
pm2 status
```

#### 2.9 Проверка результатов
```bash
# Проверяем, что приложение запустилось
curl -I http://localhost:3000

# Проверяем статус PM2
pm2 list

# Проверяем логи
pm2 logs gardenfab --lines 20

# Проверяем статус сервисов
sudo systemctl status nginx
sudo systemctl status postgresql
```

#### 2.10 Устранение возможных проблем

**Если скрипт не запускается:**
```bash
# Проверяем синтаксис
bash -n deploy.sh

# Запускаем с подробным выводом
bash -x deploy.sh production
```

**Если приложение не запускается:**
```bash
# Проверяем логи
pm2 logs gardenfab

# Перезапускаем
pm2 restart gardenfab

# Проверяем переменные окружения
pm2 env gardenfab
```

**Если база данных недоступна:**
```bash
# Проверяем статус PostgreSQL
sudo systemctl status postgresql

# Перезапускаем сервис
sudo systemctl restart postgresql

# Проверяем подключение
sudo -u postgres psql -d gardenfab -c "SELECT 1;"
```

## 📋 Минимальная настройка

### Установка необходимых пакетов
```bash
sudo apt update && sudo apt install -y nodejs npm postgresql nginx git
```

### Создание базы данных
```bash
sudo -u postgres psql
CREATE DATABASE gardenfab;
CREATE USER gardenfab_user WITH PASSWORD 'пароль123';
GRANT ALL PRIVILEGES ON DATABASE gardenfab TO gardenfab_user;
\q
```

### Клонирование и запуск
```bash
cd /var/www
sudo git clone https://github.com/ваш_username/gardenfab.git
sudo chown -R $USER:$USER gardenfab
cd gardenfab
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

## 🔧 Основные команды управления

```bash
# Статус приложения
pm2 status

# Логи приложения
pm2 logs gardenfab

# Перезапуск
pm2 restart gardenfab

# Перезагрузка Nginx
sudo systemctl reload nginx

# Статус сервисов
sudo systemctl status nginx postgresql
```

## 🌐 Настройка домена

1. Укажите DNS на ваш сервер
2. Отредактируйте `/etc/nginx/sites-available/gardenfab`
3. Замените `ваш_домен.com` на реальный домен
4. Перезагрузите Nginx

## 📱 Проверка работоспособности

```bash
# Локально
curl http://localhost:3000

# С внешнего IP
curl http://ваш_сервер_ip
```

## 🆘 Если что-то пошло не так

```bash
# Проверка логов
pm2 logs gardenfab
sudo tail -f /var/log/nginx/error.log

# Перезапуск всего
pm2 restart all
sudo systemctl restart nginx postgresql
```

---
**Полная инструкция:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
