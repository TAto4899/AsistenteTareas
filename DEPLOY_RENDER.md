# 🚀 DEPLOY A RENDER (ALTERNATIVA A RAILWAY)

## ¿Por qué Render?
- ✅ Más estable que Railway
- ✅ Plan gratuito generoso
- ✅ PostgreSQL gratis incluido
- ✅ Deploy automático desde GitHub
- ✅ SSL/HTTPS automático

---

## 📋 PASO 1: CREAR CUENTA EN RENDER

1. Ve a: **https://render.com**
2. Click en **"Get Started"** o **"Sign Up"**
3. Selecciona **"Sign up with GitHub"**
4. Autoriza Render
5. ✅ Cuenta creada

---

## 📋 PASO 2: CREAR BASE DE DATOS POSTGRESQL

⚠️ **IMPORTANTE: Haz esto PRIMERO**

1. En el Dashboard de Render, click en **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configuración:
   - **Name:** asistente-tareas-db
   - **Database:** asistente_tareas
   - **User:** (dejar por defecto)
   - **Region:** Oregon (US West) o el más cercano
   - **Plan:** Free
4. Click en **"Create Database"**
5. Espera 1-2 minutos
6. ✅ Copia la **"Internal Database URL"** (la necesitarás)

---

## 📋 PASO 3: CREAR WEB SERVICE

1. Click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub:
   - Click en **"Connect a repository"**
   - Autoriza Render si lo pide
   - Busca y selecciona: **AsistenteTareas**
3. Click en **"Connect"**

---

## 📋 PASO 4: CONFIGURAR EL WEB SERVICE

Render te mostrará un formulario de configuración:

**Name:** asistente-tareas

**Region:** Oregon (US West) u Oregon

**Branch:** master

**Root Directory:** `backend`  ⚠️ **MUY IMPORTANTE**

**Runtime:** Python 3

**Build Command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --no-input
```

**Start Command:**
```bash
gunicorn core.wsgi:application
```

**Plan:** Free

---

## 📋 PASO 5: VARIABLES DE ENTORNO

Scroll hasta **"Environment Variables"** y agrega:

Click en **"Add Environment Variable"** para cada una:

**Variable 1:**
- Key: `SECRET_KEY`
- Value: `7%=-d4l_$h+(j9ie#%r*n9yfh6y@r^%w(kegjxie7r_j=uu-f6`

**Variable 2:**
- Key: `DEBUG`
- Value: `False`

**Variable 3:**
- Key: `ALLOWED_HOSTS`
- Value: `.onrender.com`

**Variable 4:**
- Key: `DATABASE_URL`
- Value: (pega la Internal Database URL que copiaste del PASO 2)

**Variable 5:**
- Key: `PYTHON_VERSION`
- Value: `3.12.0`

**Variable 6:**
- Key: `CORS_ALLOWED_ORIGINS`
- Value: `https://tu-frontend.vercel.app` (lo cambiaremos después)

**Variable 7:**
- Key: `CSRF_TRUSTED_ORIGINS`
- Value: `https://tu-backend.onrender.com` (lo actualizaremos después)

---

## 📋 PASO 6: AUTO-DEPLOY

Marca el checkbox:
☑️ **Auto-Deploy:** Yes

---

## 📋 PASO 7: CREAR EL SERVICIO

1. Click en **"Create Web Service"** (botón al final)
2. Render empezará a hacer el build
3. Verás los logs en tiempo real
4. ⏱️ **Primer deploy: 5-10 minutos**

---

## 📋 PASO 8: VER LOGS DEL DEPLOY

En la página de tu servicio verás:
- ✅ Installing dependencies...
- ✅ Collecting static files...
- ✅ Starting Gunicorn...
- ✅ Your service is live 🎉

---

## 📋 PASO 9: OBTENER LA URL

1. Cuando termine el deploy, verás arriba:
   `https://asistente-tareas.onrender.com`
2. ✅ ¡Copia esta URL!

---

## 📋 PASO 10: ACTUALIZAR VARIABLES

Ahora que tienes la URL, actualiza:

1. Ve a **"Environment"** (menú izquierdo)
2. Actualiza estas variables:

**CSRF_TRUSTED_ORIGINS:**
```
https://asistente-tareas.onrender.com
```

**ALLOWED_HOSTS:**
```
.onrender.com
```

3. Click en **"Save Changes"**
4. Render hará redeploy automáticamente (~2 min)

---

## 📋 PASO 11: VERIFICAR

1. Ve a: `https://tu-servicio.onrender.com/api/tareas/`
2. Deberías ver:
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```
3. ✅ ¡Tu backend está funcionando!

---

## 🆘 TROUBLESHOOTING

### Error: "Build failed"
**Solución:**
- Verifica que "Root Directory" sea `backend`
- Verifica los comandos de build y start
- Revisa los logs para ver el error específico

### Error: "Application failed to respond"
**Solución:**
- Verifica que agregaste todas las variables de entorno
- Verifica que DATABASE_URL sea correcta
- Revisa los logs

### Error: "Static files not found"
**Solución:**
- Verifica que el Build Command incluya `collectstatic`

---

## ⚡ VENTAJAS DE RENDER VS RAILWAY

✅ Más estable
✅ Mejor documentación
✅ UI más clara
✅ Menos problemas de deploy
✅ PostgreSQL más confiable

---

## 💰 PLAN GRATUITO

**Incluye:**
- 750 horas/mes de servicio web
- PostgreSQL con 1GB de almacenamiento
- 100GB de ancho de banda
- SSL automático
- Deploy automático desde GitHub

⚠️ **Nota:** Los servicios gratuitos se duermen después de 15 min de inactividad.
Se despiertan automáticamente cuando alguien accede (toma 30-60 segundos).

---

## ✅ CHECKLIST

- [ ] Cuenta en Render creada
- [ ] PostgreSQL creado
- [ ] Web Service creado
- [ ] Root Directory: backend
- [ ] Variables de entorno configuradas (7 variables)
- [ ] Build Command configurado
- [ ] Start Command configurado
- [ ] Deploy exitoso
- [ ] URL pública obtenida
- [ ] API responde en /api/tareas/

---

**¿Listo para probar con Render?** Es mucho más confiable. 🚀
