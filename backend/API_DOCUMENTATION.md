# 📚 Documentación de la API - Gestor de Tareas

## 🔐 Autenticación

### Obtener CSRF Token
```
GET /api/csrf/
```
**Respuesta:**
```json
{
  "detail": "CSRF cookie set"
}
```

### Iniciar Sesión
```
POST /api/login/
```
**Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```
**Respuesta:**
```json
{
  "username": "usuario",
  "email": "usuario@email.com",
  "first_name": "Nombre",
  "last_name": "Apellido"
}
```

### Registrar Usuario
```
POST /api/register/
```
**Body:**
```json
{
  "username": "nuevousuario",
  "email": "usuario@email.com",
  "password": "contraseña123",
  "password_confirm": "contraseña123",
  "first_name": "Nombre",
  "last_name": "Apellido"
}
```

### Cerrar Sesión
```
POST /api/logout/
```

### Usuario Actual
```
GET /api/user/
```

---

## 📝 Tareas (CRUD)

### Listar Tareas
```
GET /api/tareas/
```

**Parámetros de búsqueda:**
- `search`: Buscar en título y descripción
- `status`: `completed`, `pending`
- `prioridad`: `A` (Alta), `M` (Media), `B` (Baja)
- `vencidas`: `true` (solo tareas vencidas)
- `ordering`: `-creada_en`, `prioridad`, `fecha_vencimiento`
- `page`: Número de página
- `page_size`: Tamaños de página (max 100)

**Ejemplos:**
```
GET /api/tareas/?search=compras
GET /api/tareas/?status=pending&prioridad=A
GET /api/tareas/?ordering=-prioridad
GET /api/tareas/?vencidas=true
```

### Crear Tarea
```
POST /api/tareas/
```
**Body:**
```json
{
  "titulo": "Comprar víveres",
  "descripcion": "Leche, pan, huevos",
  "prioridad": "M",
  "fecha_vencimiento": "2025-11-10"
}
```

**Validaciones:**
- `titulo`: Requerido, mínimo 3 caracteres, máximo 200
- `prioridad`: Solo `A`, `M`, `B`
- `fecha_vencimiento`: No puede ser en el pasado

### Ver Tarea
```
GET /api/tareas/{id}/
```

**Respuesta:**
```json
{
  "id": 1,
  "titulo": "Comprar víveres",
  "descripcion": "Leche, pan, huevos",
  "completada": false,
  "prioridad": "M",
  "fecha_vencimiento": "2025-11-10",
  "creada_en": "2025-11-03T20:00:00Z",
  "usuario": "testuser",
  "dias_restantes": 7,
  "esta_vencida": false
}
```

### Actualizar Tarea
```
PUT /api/tareas/{id}/
PATCH /api/tareas/{id}/
```
**Body (PUT - todos los campos):**
```json
{
  "titulo": "Comprar víveres actualizado",
  "descripcion": "Lista completa",
  "prioridad": "A",
  "completada": false,
  "fecha_vencimiento": "2025-11-15"
}
```

**Body (PATCH - campos opcionales):**
```json
{
  "completada": true
}
```

### Eliminar Tarea
```
DELETE /api/tareas/{id}/
```

---

## 📊 Endpoints Personalizados

### Estadísticas del Usuario
```
GET /api/tareas/estadisticas/
```

**Respuesta:**
```json
{
  "total": 25,
  "completadas": 15,
  "pendientes": 10,
  "vencidas": 3,
  "proximas_vencer": 5,
  "por_prioridad": {
    "alta": 5,
    "media": 12,
    "baja": 8
  },
  "porcentaje_completadas": 60.0
}
```

### Completar Múltiples Tareas
```
POST /api/tareas/completar_multiples/
```

**Body:**
```json
{
  "ids": [1, 2, 3, 5]
}
```

**Respuesta:**
```json
{
  "detail": "4 tarea(s) marcada(s) como completada(s)",
  "count": 4
}
```

### Limpiar Tareas Completadas
```
DELETE /api/tareas/limpiar_completadas/
```

**Respuesta:**
```json
{
  "detail": "15 tarea(s) completada(s) eliminada(s)",
  "count": 15
}
```

---

## 🚫 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Límite de peticiones excedido |
| 500 | Internal Server Error - Error del servidor |

---

## 🔒 Límites de Peticiones (Rate Limiting)

- **Usuarios no autenticados:** 100 peticiones/hora
- **Usuarios autenticados:** 1000 peticiones/hora

---

## 📄 Paginación

Todas las listas están paginadas:

**Respuesta:**
```json
{
  "count": 50,
  "next": "http://127.0.0.1:8000/api/tareas/?page=2",
  "previous": null,
  "results": [...]
}
```

**Parámetros:**
- `page`: Número de página (default: 1)
- `page_size`: Tamaño de página (default: 20, max: 100)

---

## 🧪 Ejemplos con cURL

### Login y crear tarea
```bash
# 1. Obtener CSRF token
curl -c cookies.txt http://127.0.0.1:8000/api/csrf/

# 2. Login
CSRF=$(grep csrftoken cookies.txt | awk '{print $7}')
curl -b cookies.txt -c cookies.txt -X POST \
  http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF" \
  -d '{"username":"testuser","password":"testpass123"}'

# 3. Crear tarea
CSRF=$(grep csrftoken cookies.txt | awk '{print $7}')
curl -b cookies.txt -X POST \
  http://127.0.0.1:8000/api/tareas/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF" \
  -d '{
    "titulo": "Tarea desde cURL",
    "descripcion": "Descripción de prueba",
    "prioridad": "A",
    "fecha_vencimiento": "2025-11-15"
  }'

# 4. Ver estadísticas
curl -b cookies.txt http://127.0.0.1:8000/api/tareas/estadisticas/
```

---

## 🛠️ Configuración de Django Admin

Accede a `/admin/` para gestionar:
- Usuarios
- Tareas
- Ver estadísticas
- Filtros avanzados

---

## 📝 Notas Importantes

1. Todas las peticiones POST/PUT/PATCH/DELETE requieren el header `X-CSRFToken`
2. Las cookies deben estar habilitadas (`credentials: 'include'` en fetch/axios)
3. Los usuarios solo pueden ver y modificar sus propias tareas
4. Las fechas deben estar en formato ISO: `YYYY-MM-DD`
5. Los timestamps están en UTC

---

## 🔄 Campos Calculados Automáticamente

- `dias_restantes`: Calcula automáticamente los días hasta el vencimiento
- `esta_vencida`: Indica si la tarea está vencida (fecha pasada y no completada)
- `creada_en`: Se asigna automáticamente al crear
- `actualizada_en`: Se actualiza automáticamente al modificar
- `usuario`: Se asigna automáticamente al usuario autenticado
