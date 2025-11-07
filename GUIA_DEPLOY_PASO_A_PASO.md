# 🚀 GUÍA PASO A PASO - DEPLOY A RAILWAY (PRINCIPIANTES)

## 📋 PASO 1: CREAR CUENTA EN RAILWAY

1. Abre tu navegador
2. Ve a: **https://railway.app**
3. Click en **"Login"** (arriba a la derecha)
4. Selecciona **"Login with GitHub"**
5. Autoriza Railway para acceder a tu GitHub
6. ✅ Ya tienes cuenta

---

## 📋 PASO 2: CREAR NUEVO PROYECTO

1. Ya estás en el Dashboard de Railway
2. Click en el botón **"New Project"** (morado)
3. Selecciona **"Deploy from GitHub repo"**
4. Busca tu repositorio: **"AsistenteTareas"**
5. Click en tu repositorio
6. Railway empezará a detectar tu proyecto
7. ⏸️ **ESPERA** - Aún no está listo

---

## 📋 PASO 3: AGREGAR BASE DE DATOS POSTGRESQL

⚠️ **IMPORTANTE: Haz esto ANTES de configurar el backend**

1. En tu proyecto (pantalla principal)
2. Click en el botón **"+ New"** (arriba a la derecha)
3. Selecciona **"Database"**
4. Click en **"Add PostgreSQL"**
5. Railway creará la base de datos (espera 10-20 segundos)
6. ✅ Verás un nuevo servicio "PostgreSQL" en tu proyecto

---

## 📋 PASO 4: CONFIGURAR VARIABLES DE ENTORNO

1. Click en el servicio de tu **aplicación** (no la base de datos)
2. Ve a la pestaña **"Variables"** (arriba)
3. Click en **"+ New Variable"** o **"RAW Editor"**
4. Copia y pega EXACTAMENTE esto:

```
SECRET_KEY=7%=-d4l_$h+(j9ie#%r*n9yfh6y@r^%w(kegjxie7r_j=uu-f6
DEBUG=False
ALLOWED_HOSTS=.railway.app
```

5. Click en **"Add"** o guardar
6. ✅ Variables configuradas

---

## 📋 PASO 5: VERIFICAR CONFIGURACIÓN

1. Todavía en tu servicio de aplicación
2. Ve a **"Settings"** (⚙️)
3. Busca la sección **"Service Settings"** o **"Deploy"**
4. **NO NECESITAS configurar Root Directory** (el Dockerfile maneja esto)
5. ✅ Deja todo por defecto

---

## 📋 PASO 6: HACER DEPLOY

Opción A - Deploy Automático:
- Railway ya debería estar haciendo deploy automáticamente
- Ve a **"Deployments"** para ver el progreso

Opción B - Deploy Manual:
1. Ve a **"Deployments"**
2. Click en **"Deploy"** o **"Redeploy"**
3. Espera 3-5 minutos

---

## 📋 PASO 7: VER LOGS DEL DEPLOY

1. En **"Deployments"**
2. Click en el deployment que está en progreso
3. Verás los logs en tiempo real:
   - ✅ Building... (1-2 min)
   - ✅ Deploying... (1 min)
   - ✅ Success! (si todo salió bien)

**Logs que deberías ver:**
```
Step 1/7 : FROM python:3.12-slim
Step 2/7 : ENV PYTHONUNBUFFERED=1
Step 3/7 : WORKDIR /app
Step 4/7 : COPY backend/requirements.txt .
Step 5/7 : RUN pip install...
Step 6/7 : COPY backend/ .
Step 7/7 : CMD python manage.py migrate...
```

---

## 📋 PASO 8: OBTENER LA URL DE TU BACKEND

1. Después de que el deploy termine
2. Ve a **"Settings"**
3. Busca **"Networking"** o **"Public Networking"**
4. Click en **"Generate Domain"**
5. Railway te dará una URL como:
   `https://tu-proyecto.up.railway.app`
6. ✅ ¡Copia esta URL!

---

## 📋 PASO 9: VERIFICAR QUE FUNCIONA

1. Abre tu navegador
2. Ve a: `https://tu-proyecto.up.railway.app/api/tareas/`
3. Deberías ver:
   ```json
   {
     "count": 0,
     "next": null,
     "previous": null,
     "results": []
   }
   ```
4. ✅ ¡Tu backend está funcionando!

---

## 🆘 SI ALGO SALE MAL

### Error: "Application failed to respond"
**Solución:**
- Ve a "Deployments" → "View Logs"
- Busca errores en rojo
- Copia el error y me lo pasas

### Error: "No variables de entorno"
**Solución:**
- Ve a "Variables"
- Asegúrate de tener SECRET_KEY, DEBUG, ALLOWED_HOSTS
- Redeploy

### Error: "Database connection failed"
**Solución:**
- Verifica que agregaste PostgreSQL
- Railway debería crear DATABASE_URL automáticamente
- Ve a "Variables" y verifica que existe DATABASE_URL

---

## 📸 CAPTURAS DE PANTALLA ÚTILES

Si tienes problemas, toma capturas de:
1. La página principal del proyecto (donde ves los servicios)
2. La pestaña "Variables"
3. Los logs del deployment
4. El error específico que ves

---

## ✅ CHECKLIST FINAL

- [ ] Cuenta en Railway creada
- [ ] Proyecto creado desde GitHub
- [ ] PostgreSQL agregado
- [ ] Variables de entorno configuradas (SECRET_KEY, DEBUG, ALLOWED_HOSTS)
- [ ] Deploy completado exitosamente
- [ ] URL generada
- [ ] API responde en /api/tareas/

---

**¿En qué paso estás ahora?** Dime y te ayudo específicamente con ese paso. 🎯
