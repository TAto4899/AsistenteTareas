# 📝 Asistente de Tareas

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![Django](https://img.shields.io/badge/django-5.2.7-green.svg)
![React](https://img.shields.io/badge/react-19.0-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

Una aplicación web moderna y completa para gestionar tareas con funcionalidades avanzadas, diseño responsive y PWA instalable.

[Demo en Vivo](https://asistente-tareas-eae7.vercel.app) · [Reportar Bug](https://github.com/TAto4899/AsistenteTareas/issues) · [Solicitar Feature](https://github.com/TAto4899/AsistenteTareas/issues)

</div>

---

## ✨ Características Principales

### 🎯 Gestión de Tareas
- ✅ **CRUD Completo** - Crear, leer, actualizar y eliminar tareas
- 📅 **Fechas y Horas** - Establece fecha y hora de vencimiento
- 🏷️ **Etiquetas** - Organiza con etiquetas personalizables y coloreadas
- ✔️ **Subtareas** - Divide tareas grandes con checklist y barra de progreso
- 🎯 **Prioridades** - Alta, Media, Baja con indicadores visuales
- 🔍 **Búsqueda y Filtros** - Búsqueda en tiempo real con debouncing

### 🎨 Interfaz y UX
- 🌓 **Modo Oscuro** - Cambia entre modo claro y oscuro
- 🎨 **6 Temas Personalizados** - Verde, Azul, Púrpura, Naranja, Teal, Rosa
- 📱 **Diseño Responsive** - Funciona perfectamente en móvil, tablet y escritorio
- 🔔 **Notificaciones** - Alertas del navegador para tareas próximas a vencer
- ⚡ **Drag & Drop** - Reordena tareas arrastrando

### 📊 Productividad
- 📈 **Gráficos de Productividad** - 4 tipos de gráficos (barras, líneas, área, pie)
- 📊 **Estadísticas en Tiempo Real** - Total, completadas, pendientes, vencidas
- 📤 **Exportar a CSV** - Descarga todas tus tareas
- 🔗 **Compartir Tareas** - Genera link público para compartir

### 🚀 Tecnologías Avanzadas
- 📱 **PWA (Progressive Web App)** - Instalable y funciona offline
- 🔄 **Service Worker** - Caché inteligente de recursos
- 🎯 **Optimistic Updates** - UI super rápida y reactiva
- 🔐 **Autenticación Segura** - Sistema de login/registro robusto

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Django 5.2.7** - Framework web Python
- **Django REST Framework 3.16.1** - API REST
- **PostgreSQL** - Base de datos en producción
- **Gunicorn** - Servidor WSGI
- **WhiteNoise** - Servir archivos estáticos

### Frontend
- **React 19** - Biblioteca UI
- **Vite 7** - Build tool ultrarrápido
- **React Router DOM 7** - Navegación
- **Axios** - Cliente HTTP
- **Recharts 3** - Gráficos
- **@dnd-kit** - Drag & Drop

### Deploy
- **Render** - Backend + PostgreSQL
- **Vercel** - Frontend
- **GitHub Actions** - CI/CD automático

---

## 🚀 Demo en Vivo

### 🌐 Aplicación en Producción
**👉 [https://asistente-tareas-eae7.vercel.app](https://asistente-tareas-eae7.vercel.app)**

### 📱 Instalar como PWA
1. Abre la app en Chrome/Edge
2. Click en el ícono de instalación en la barra de direcciones
3. ¡Listo! Ahora funciona como app nativa

### 🧪 Cuenta de Prueba
Puedes crear tu propia cuenta o usar:
- **Usuario:** demo
- **Password:** demo123 _(crear cuenta nueva recomendado)_

---

## 📦 Instalación Local

### Requisitos Previos
- Python 3.12+
- Node.js 18+
- PostgreSQL (opcional, usa SQLite por defecto)
- Git

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/TAto4899/AsistenteTareas.git
cd AsistenteTareas
```

### 2️⃣ Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
cp .env.example .env

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor backend
python manage.py runserver 8001
```

El backend estará en: `http://localhost:8001`

### 3️⃣ Configurar Frontend

```bash
# En otra terminal, navegar a frontend
cd frontend/frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará en: `http://localhost:5173`

---

## 🔧 Configuración

### Variables de Entorno - Backend (.env)

```env
# Django Settings
SECRET_KEY=tu-secret-key-super-segura
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (opcional - usa SQLite por defecto)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

### Variables de Entorno - Frontend (.env)

```env
# API URL
VITE_API_URL=http://localhost:8001
```

---

## 📸 Screenshots

### 🏠 Vista Principal
> Interfaz limpia y moderna con todas las tareas

### 📊 Gráficos de Productividad
> Visualiza tu progreso con 4 tipos de gráficos interactivos

### 🌙 Modo Oscuro
> Cuida tus ojos con el modo oscuro

### 🎨 Temas Personalizados
> 6 paletas de colores para elegir

### 📱 Responsive Design
> Funciona perfecto en cualquier dispositivo

_Nota: Agrega screenshots reales en la carpeta `/screenshots` del proyecto_

---

## 📚 Documentación de la API

### Endpoints Principales

#### Autenticación
```http
POST /api/registro/          # Registrar usuario
POST /api/login/             # Iniciar sesión
POST /api/logout/            # Cerrar sesión
```

#### Tareas
```http
GET    /api/tareas/          # Listar tareas
POST   /api/tareas/          # Crear tarea
GET    /api/tareas/{id}/     # Ver tarea
PUT    /api/tareas/{id}/     # Actualizar tarea
DELETE /api/tareas/{id}/     # Eliminar tarea
POST   /api/tareas/{id}/completar/     # Toggle completar
GET    /api/tareas/estadisticas/       # Estadísticas
```

#### Etiquetas
```http
GET    /api/etiquetas/       # Listar etiquetas
POST   /api/etiquetas/       # Crear etiqueta
DELETE /api/etiquetas/{id}/  # Eliminar etiqueta
```

#### Subtareas
```http
GET    /api/subtareas/       # Listar subtareas
POST   /api/subtareas/       # Crear subtarea
PUT    /api/subtareas/{id}/  # Actualizar subtarea
DELETE /api/subtareas/{id}/  # Eliminar subtarea
```

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend/frontend
npm run test
```

---

## 📁 Estructura del Proyecto

```
AsistenteTareas/
├── backend/                 # Django Backend
│   ├── core/               # Configuración Django
│   │   ├── settings.py    # Settings principal
│   │   ├── urls.py        # URLs principales
│   │   └── wsgi.py        # WSGI config
│   ├── tareas/            # App principal
│   │   ├── models.py      # Modelos (Tarea, Etiqueta, Subtarea)
│   │   ├── serializers.py # Serializers DRF
│   │   ├── views.py       # ViewSets y vistas
│   │   ├── urls.py        # URLs de la app
│   │   └── admin.py       # Django Admin
│   ├── requirements.txt   # Dependencias Python
│   └── manage.py          # Django CLI
│
├── frontend/frontend/      # React Frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Context API (Auth, Theme)
│   │   ├── pages/         # Páginas principales
│   │   ├── api.js         # Configuración Axios
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Entry point
│   ├── public/            # Assets públicos
│   │   ├── manifest.json  # PWA manifest
│   │   └── sw.js          # Service Worker
│   ├── package.json       # Dependencias Node
│   └── vite.config.js     # Configuración Vite
│
├── .gitignore
├── README.md
├── DEPLOY_COMPLETADO.md   # Docs de deploy
└── ESTADO_FINAL.md        # Estado del proyecto
```

---

## 🚀 Deploy en Producción

### Backend (Render)
1. Fork este repositorio
2. Crea cuenta en [Render.com](https://render.com)
3. Crea PostgreSQL database
4. Crea Web Service apuntando a `/backend`
5. Configura variables de entorno
6. Deploy automático 🎉

Ver guía completa en: [DEPLOY_COMPLETADO.md](DEPLOY_COMPLETADO.md)

### Frontend (Vercel)
1. Crea cuenta en [Vercel.com](https://vercel.com)
2. Importa el repositorio
3. Root Directory: `frontend/frontend`
4. Agrega variable `VITE_API_URL`
5. Deploy automático 🎉

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Si quieres contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/TAto4899/AsistenteTareas/issues) con:
- Descripción del bug
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Sistema operativo y navegador

---

## 📋 Roadmap

### Próximas Funcionalidades (Opcional)
- [ ] Notificaciones Push reales
- [ ] Colaboradores en tareas
- [ ] Login con Google/GitHub
- [ ] Búsqueda avanzada
- [ ] Dashboard administrativo
- [ ] Aplicación móvil nativa (React Native)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Franco Marin**

- GitHub: [@TAto4899](https://github.com/TAto4899)
- Email: franco48993625@gmail.com

---

## 🌟 Agradecimientos

- [Django](https://www.djangoproject.com/) - Framework backend
- [React](https://react.dev/) - Biblioteca UI
- [Vite](https://vitejs.dev/) - Build tool
- [Recharts](https://recharts.org/) - Librería de gráficos
- [dnd-kit](https://dndkit.com/) - Drag & Drop
- [Render](https://render.com/) - Hosting backend
- [Vercel](https://vercel.com/) - Hosting frontend

---

## 💡 Inspiración

Este proyecto nace de la necesidad de tener una aplicación de gestión de tareas:
- ✅ Moderna y rápida
- ✅ Con funcionalidades avanzadas
- ✅ Sin depender de servicios de terceros
- ✅ Open source y self-hosted
- ✅ PWA instalable

---

<div align="center">

### ⭐ Si te gusta el proyecto, dale una estrella en GitHub!

**Desarrollado con ❤️ usando Django + React**

[⬆ Volver arriba](#-asistente-de-tareas)

</div>
