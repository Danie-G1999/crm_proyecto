FROM php:8.3-fpm
# Crear directorios de almacenamiento y caché si no existen
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/app/public \
    bootstrap/cache

# Asignar permisos de escritura para el servidor web/Laravel
RUN chmod -R 777 storage bootstrap/cache
# Instalar dependencias del sistema y extensiones necesarias (incluyendo PostgreSQL)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nginx

RUN docker-php-ext-install pdo pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Instalar dependencias de PHP ignorando restricciones de plataforma de Composer
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Puerto expuesto
EXPOSE 80

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=80
