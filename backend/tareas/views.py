# backend/tareas/views.py

from rest_framework import viewsets, permissions
from .models import Tarea
from .serializers import TareaSerializer

class TareaViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite a los usuarios ver o editar sus propias tareas.
    """
    serializer_class = TareaSerializer
    
    # 1. PERMISO: Solo usuarios autenticados pueden usar esta API
    permission_classes = [permissions.IsAuthenticated]

    # 2. LÓGICA DE CONSULTA (GET) - CORREGIDA
    def get_queryset(self):
        # Obtenemos el usuario de la petición
        user = self.request.user
        
        # Primero, revisamos si el usuario está autenticado
        if user.is_authenticated:
            # Si lo está, devolvemos solo sus tareas
            return Tarea.objects.filter(usuario=user).order_by('-creada_en')
        
        # Si no lo está (es AnonymousUser), devolvemos un queryset vacío.
        # La clase de permiso [IsAuthenticated] se encargará de
        # bloquear la petición con un error 401, pero esto
        # evita que nuestro código se rompa primero.
        return Tarea.objects.none()

    # 3. LÓGICA DE CREACIÓN (POST):
    def perform_create(self, serializer):
        # Asigna la tarea al usuario que está logueado
        serializer.save(usuario=self.request.user)