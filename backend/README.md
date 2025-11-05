# 🚀 Backend - Gestor de Tareas

API REST desarrollada con Django y Django REST Framework para gestión de tareas personales.

## 🌟 Características

### Autenticación y Usuarios
- ✅ Sistema de login/logout con sesiones
- ✅ Registro de nuevos usuarios con validaciones
- ✅ Protección CSRF
- ✅ Rate limiting (límite de peticiones)

### Gestión de Tareas
- ✅ CRUD completo de tareas
- ✅ Búsqueda por título y descripción
- ✅ Filtros por estado (completada/pendiente)
- ✅ Filtros por prioridad (Alta/Media/Baja)
- ✅ Ordenamiento flexible
- ✅ Detección automática de tareas vencidas
- ✅ Cálculo de días restantes

### Endpoints Especiales
- ✅ Estadísticas del usuario
- ✅ Completar múltiples tareas a la vez
- ✅ Limpiar tareas completadas
- ✅ Paginación automática

### Validaciones
- ✅ Validación de títulos (mínimo 3 caracteres)
- ✅ Validación de fechas (no permite fechas pasadas)
- ✅ Validación de prioridades
- ✅ Validación de emails únicos
- ✅ Validación de usernames únicos

## 📋 Requisitos

- Python 3.8+
- pip
- virtualenv (recomendado)

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
cd backend
```

### 2. Crear entorno virtual
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Aplicar migraciones
```bash
python manage.py migrate
```

### 5. Crear superusuario (admin)
```bash
python manage.py createsuperuser
```

### 6. Iniciar servidor
```bash
python manage.py runserver
```

El servidor estará disponible en `http://127.0.0.1:8000/`

## 🗂️ Estructura del Proyecto

```
backend/
├── core/                   # Configuración principal del proyecto
│   ├── settings.py        # Configuración de Django
│   ├── urls.py           # URLs principales
│   └── wsgi.py           # Configuración WSGI
├── tareas/                # App de tareas
│   ├── models.py         # Modelo de datos
│   ├── serializers.py    # Serializers de DRF
│   ├── views.py          # Vistas y lógica de negocio
│   ├── urls.py           # URLs de la app
│   ├── admin.py          # Configuración del admin
│   └── migrations/       # Migraciones de BD
├── db.sqlite3            # Base de datos SQLite
├── manage.py             # Script de gestión de Django
├── requirements.txt      # Dependencias del proyecto
└── API_DOCUMENTATION.md  # Documentación completa de la API
```

## 🔌 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/csrf/` | Obtener token CSRF |
| POST | `/api/login/` | Iniciar sesión |
| POST | `/api/register/` | Registrar usuario |
| POST | `/api/logout/` | Cerrar sesión |
| GET | `/api/user/` | Usuario actual |
| GET | `/api/tareas/` | Listar tareas |
| POST | `/api/tareas/` | Crear tarea |
| GET | `/api/tareas/{id}/` | Ver tarea |
| PUT/PATCH | `/api/tareas/{id}/` | Actualizar tarea |
| DELETE | `/api/tareas/{id}/` | Eliminar tarea |
| GET | `/api/tareas/estadisticas/` | Estadísticas |
| POST | `/api/tareas/completar_multiples/` | Completar varias |
| DELETE | `/api/tareas/limpiar_completadas/` | Eliminar completadas |

Ver documentación completa en [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🎯 Ejemplos de Uso

### Crear una tarea
```python
import requests

# Login
session = requests.Session()
session.get('http://127.0.0.1:8000/api/csrf/')
csrf = session.cookies['csrftoken']

session.post('http://127.0.0.1:8000/api/login/', 
    json={'username': 'user', 'password': 'pass'},
    headers={'X-CSRFToken': csrf}
)

# Crear tarea
response = session.post('http://127.0.0.1:8000/api/tareas/',
    json={
        'titulo': 'Mi tarea',
        'descripcion': 'Descripción',
        'prioridad': 'A',
        'fecha_vencimiento': '2025-12-31'
    },
    headers={'X-CSRFToken': csrf}
)
print(response.json())
```

## 🛡️ Seguridad

- ✅ Protección CSRF activada
- ✅ CORS configurado para localhost
- ✅ Rate limiting (100 req/h anónimos, 1000 req/h autenticados)
- ✅ Validación de datos en serializers
- ✅ Autenticación por sesión
- ✅ Passwords hasheados con PBKDF2

## 📊 Admin de Django

Accede al panel de administración en `/admin/`:
- Gestiona usuarios
- Visualiza y edita tareas
- Usa filtros avanzados
- Exporta datos

## 🧪 Testing

```bash
# Ejecutar tests
python manage.py test

# Ejecutar tests con coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## 🔄 Migraciones

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ver estado de migraciones
python manage.py showmigrations
```

## 📝 Variables de Entorno (Producción)

Crear archivo `.env`:
```
SECRET_KEY=tu-secret-key-super-secreta
DEBUG=False
ALLOWED_HOSTS=tudominio.com,www.tudominio.com
DATABASE_URL=postgres://user:pass@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://tudominio.com
```

## 🚀 Deploy

### Con Gunicorn
```bash
pip install gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Con Docker
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 📚 Recursos

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [API Documentation](API_DOCUMENTATION.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto.

## 👨‍💻 Autor

Franco Marin

---

¿Preguntas? Abre un issue en GitHub.
