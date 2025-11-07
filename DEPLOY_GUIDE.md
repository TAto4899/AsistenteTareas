# 🎯 Asistente de Tareas - Guía Completa de Deploy

## 📋 Tabla de Contenido

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración Local](#configuración-local)
3. [Deploy Backend (Railway)](#deploy-backend-railway)
4. [Deploy Frontend (Vercel)](#deploy-frontend-vercel)
5. [Configuración Post-Deploy](#configuración-post-deploy)
6. [Verificación](#verificación)
7. [Mantenimiento](#mantenimiento)

---

## 🔧 Requisitos Previos

- ✅ Cuenta de GitHub
- ✅ Git instalado
- ✅ Node.js 18+ y npm
- ✅ Python 3.12+
- ✅ Cuenta en Railway (https://railway.app)
- ✅ Cuenta en Vercel (https://vercel.com)

---

## 💻 Configuración Local

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de entorno
cp .env.example .env

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver 8001
```

### Frontend

```bash
cd frontend/frontend

# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env

# Ejecutar servidor de desarrollo
npm run dev
```

---

## 🚀 Deploy Backend (Railway)

### 1. Preparar repositorio

```bash
# Asegúrate de estar en la raíz del proyecto
git add .
git commit -m "feat: preparar para deploy"
git push origin main
```

### 2. Crear proyecto en Railway

1. Ir a https://railway.app/new
2. Click en "Deploy from GitHub repo"
3. Seleccionar tu repositorio
4. Railway detectará automáticamente el `Procfile`

### 3. Configurar Root Directory

En Railway Dashboard → Settings → Deploy:
- **Root Directory:** `backend`
- Guardar cambios

### 4. Agregar PostgreSQL

1. En tu proyecto, click en "+ New"
2. Seleccionar "Database" → "PostgreSQL"
3. Railway creará automáticamente `DATABASE_URL`

### 5. Configurar Variables de Entorno

En Railway → Variables, agregar:

```env
SECRET_KEY=tu-secret-key-super-seguro-aqui
DEBUG=False
ALLOWED_HOSTS=.railway.app
CORS_ALLOWED_ORIGINS=https://tu-proyecto.vercel.app
CSRF_TRUSTED_ORIGINS=https://tu-proyecto.vercel.app,https://tu-backend.railway.app
```

**Generar SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 6. Deploy

- Railway hará el deploy automáticamente
- Esperar 3-5 minutos
- Copiar la URL pública (ej: `https://asistente-tareas-production.up.railway.app`)

### 7. Verificar

Visitar: `https://tu-backend.railway.app/api/tareas/`

---

## 🌐 Deploy Frontend (Vercel)

### 1. Importar proyecto

1. Ir a https://vercel.com/new
2. Click en "Import Git Repository"
3. Seleccionar tu repositorio

### 2. Configurar Build Settings

- **Framework Preset:** Vite
- **Root Directory:** `frontend/frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3. Variables de Entorno

En Vercel → Settings → Environment Variables:

```env
VITE_API_URL=https://tu-backend.railway.app
```

### 4. Deploy

- Click en "Deploy"
- Esperar 1-2 minutos
- Vercel te dará una URL (ej: `https://asistente-tareas.vercel.app`)

---

## 🔐 Configuración Post-Deploy

### Actualizar Variables en Railway

Ahora que tienes la URL de Vercel, actualiza en Railway:

```env
CORS_ALLOWED_ORIGINS=https://tu-proyecto.vercel.app
CSRF_TRUSTED_ORIGINS=https://tu-proyecto.vercel.app,https://tu-backend.railway.app
ALLOWED_HOSTS=.railway.app,.vercel.app
```

Railway hará redeploy automáticamente (~2 min).

---

## ✅ Verificación

### Backend
- [ ] API responde en `/api/tareas/`
- [ ] Admin funciona en `/admin/`
- [ ] PostgreSQL conectado
- [ ] Migraciones aplicadas

### Frontend
- [ ] App carga correctamente
- [ ] Puedes crear tareas
- [ ] Puedes editar tareas
- [ ] Puedes eliminar tareas
- [ ] PWA funciona (botón de instalar)
- [ ] Compartir tareas funciona
- [ ] Subtareas funcionan
- [ ] Temas personalizados funcionan

### DevTools
Abrir DevTools (F12):
- [ ] No hay errores de CORS
- [ ] No hay errores 403
- [ ] Peticiones van al backend correcto
- [ ] Service Worker registrado

---

## 🔄 Mantenimiento

### Deploy Automático

Cada vez que hagas `git push main`:
- Railway rebuildeará el backend (3-5 min)
- Vercel rebuildeará el frontend (1-2 min)

### Ver Logs

**Railway:**
Dashboard → Deployments → View Logs

**Vercel:**
Dashboard → Deployments → Ver logs

### Rollback

**Railway:**
Dashboard → Deployments → Click en deploy anterior → Redeploy

**Vercel:**
Dashboard → Deployments → Click en deploy anterior → Promote to Production

---

## 🆘 Troubleshooting

### Error 403 CSRF

**Solución:**
1. Verificar `CSRF_TRUSTED_ORIGINS` en Railway
2. Debe incluir la URL de Vercel
3. Redeploy el backend

### Error de CORS

**Solución:**
1. Verificar `CORS_ALLOWED_ORIGINS` en Railway
2. Debe incluir la URL de Vercel
3. Redeploy el backend

### Error 500 en Backend

**Solución:**
1. Ver logs en Railway
2. Verificar que todas las variables de entorno estén configuradas
3. Verificar que PostgreSQL esté conectado

### Frontend no conecta al Backend

**Solución:**
1. Verificar `VITE_API_URL` en Vercel
2. Debe apuntar a la URL de Railway
3. Redeploy el frontend

### Migraciones no se aplicaron

**Solución:**
```bash
# En Railway CLI
railway run python manage.py migrate
```

---

## 📊 Estadísticas del Proyecto

- **Backend:** Django 5.2.7 + DRF
- **Frontend:** React 19 + Vite 7
- **Base de datos:** PostgreSQL (producción) / SQLite (desarrollo)
- **Hosting:** Railway (backend) + Vercel (frontend)
- **Funcionalidades:** 19 features principales
- **PWA:** ✅ Instalable y offline
- **Temas:** 6 paletas de colores

---

## 🎉 ¡Listo!

Tu aplicación ahora está en producción y lista para usar.

**URLs de ejemplo:**
- Frontend: https://asistente-tareas.vercel.app
- Backend: https://asistente-tareas.railway.app
- API: https://asistente-tareas.railway.app/api/tareas/

---

## 📝 Próximos Pasos

Funcionalidades futuras que puedes agregar:
- [ ] Autenticación de usuarios
- [ ] Notificaciones por email
- [ ] Colaboración multi-usuario
- [ ] Integración con calendario
- [ ] Exportar a PDF
- [ ] Etiquetas más avanzadas
- [ ] Búsqueda y filtros avanzados
- [ ] Dashboard de productividad
- [ ] App móvil nativa

---

**Desarrollado con ❤️**
