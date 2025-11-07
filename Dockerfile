# Usar imagen oficial de Python
FROM python:3.12-slim

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements primero (para cache)
COPY backend/requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el proyecto
COPY backend/ .

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD python manage.py migrate --no-input && \
    python manage.py collectstatic --no-input && \
    gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
