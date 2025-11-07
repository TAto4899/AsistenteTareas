# 🚀 Deploy del Backend a Railway

## Pasos para Deploy:

### 1. Crear cuenta en Railway
- Ir a: https://railway.app/
- Registrarse con GitHub

### 2. Crear nuevo proyecto
- Click en "New Project"
- Seleccionar "Deploy from GitHub repo"
- Conectar tu repositorio

### 3. Configurar Variables de Entorno
En Railway Dashboard → Variables:

```env
SECRET_KEY=genera-un-secret-key-aleatorio-muy-largo-aqui
DEBUG=False
ALLOWED_HOSTS=.railway.app
DATABASE_URL=(Railway lo crea automáticamente cuando agregas PostgreSQL)
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://tu-frontend.vercel.app,https://tu-backend.railway.app
```

### 4. Agregar PostgreSQL
- En el proyecto, click en "+ New"
- Seleccionar "Database" → "PostgreSQL"
- Railway creará automáticamente la variable `DATABASE_URL`

### 5. Deploy
- Railway detecta automáticamente el `Procfile`
- El deploy se hace automáticamente
- Esperar 3-5 minutos

### 6. Obtener URL del backend
- En Railway Dashboard, copiar la URL pública
- Ejemplo: `https://tu-proyecto.up.railway.app`

### 7. Verificar
- Visitar: `https://tu-proyecto.up.railway.app/api/tareas/`
- Deberías ver la API funcionando

## Comandos útiles

### Generar SECRET_KEY
```python
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### Ver logs en Railway
- Dashboard → Deployments → View Logs

## Troubleshooting

### Error de migraciones
Ejecutar en Railway CLI:
```bash
railway run python manage.py migrate
```

### Error de static files
Verificar que `STATIC_ROOT` esté configurado en settings.py
