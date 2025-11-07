# 🚀 Deploy del Frontend a Vercel

## Pasos para Deploy:

### 1. Crear cuenta en Vercel
- Ir a: https://vercel.com/
- Registrarse con GitHub

### 2. Importar proyecto
- Click en "Add New..." → "Project"
- Seleccionar tu repositorio de GitHub
- Vercel detectará automáticamente que es un proyecto Vite

### 3. Configurar el proyecto
**Root Directory:** `frontend/frontend`

**Build Settings:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### 4. Variables de Entorno
En Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://tu-backend.railway.app
```

### 5. Deploy
- Click en "Deploy"
- Esperar 1-2 minutos
- Vercel te dará una URL: `https://tu-proyecto.vercel.app`

### 6. Actualizar CORS en Backend
En Railway, actualizar estas variables:

```env
CORS_ALLOWED_ORIGINS=https://tu-proyecto.vercel.app
CSRF_TRUSTED_ORIGINS=https://tu-proyecto.vercel.app,https://tu-backend.railway.app
ALLOWED_HOSTS=.railway.app,.vercel.app
```

### 7. Configurar Dominio (Opcional)
- Vercel → Settings → Domains
- Agregar tu dominio personalizado

## Deploy Automático

Cada vez que hagas `git push`:
- Vercel rebuildeará automáticamente
- Deploy en ~1-2 minutos

## Verificar

1. Visitar tu URL de Vercel
2. Abrir DevTools → Network
3. Verificar que las peticiones van al backend correcto
4. Probar crear/editar/eliminar tareas

## Troubleshooting

### Error de CORS
- Verificar que `CORS_ALLOWED_ORIGINS` incluya la URL de Vercel
- Verificar que `CSRF_TRUSTED_ORIGINS` incluya la URL de Vercel

### API no responde
- Verificar que `VITE_API_URL` apunte al backend correcto
- Verificar que el backend esté funcionando en Railway

### Service Worker no funciona
- En Vercel, el Service Worker funciona automáticamente con HTTPS
- No requiere configuración adicional
