# backend/tareas/views.py

from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q, Count, Case, When, IntegerField
from django.utils import timezone
from datetime import datetime

# --- Importaciones para el CSRF ---
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token

from .models import Tarea, Etiqueta
from .serializers import TareaSerializer, UserRegisterSerializer, EtiquetaSerializer

# --- Vista de Etiquetas ---
class EtiquetaViewSet(viewsets.ModelViewSet):
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Etiqueta.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


# --- Vista de Tareas con filtros y búsqueda ---
class TareaViewSet(viewsets.ModelViewSet):
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion']
    ordering_fields = ['creada_en', 'prioridad', 'fecha_vencimiento', 'completada']
    ordering = ['-creada_en']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Tarea.objects.none()
        
        queryset = Tarea.objects.filter(usuario=user)
        
        # Filtro por estado (completada/pendiente)
        status_param = self.request.query_params.get('status', None)
        if status_param == 'completed':
            queryset = queryset.filter(completada=True)
        elif status_param == 'pending':
            queryset = queryset.filter(completada=False)
        
        # Filtro por prioridad
        prioridad = self.request.query_params.get('prioridad', None)
        if prioridad in ['A', 'M', 'B']:
            queryset = queryset.filter(prioridad=prioridad)
        
        # Filtro por tareas vencidas
        vencidas = self.request.query_params.get('vencidas', None)
        if vencidas == 'true':
            queryset = queryset.filter(
                fecha_vencimiento__lt=timezone.now().date(),
                completada=False
            )
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'detail': 'Tarea eliminada correctamente'}, 
            status=status.HTTP_200_OK
        )

    # Endpoint personalizado para estadísticas
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        user = request.user
        tareas = Tarea.objects.filter(usuario=user)
        
        total = tareas.count()
        completadas = tareas.filter(completada=True).count()
        pendientes = tareas.filter(completada=False).count()
        
        # Tareas vencidas (no completadas y con fecha pasada)
        vencidas = tareas.filter(
            completada=False,
            fecha_vencimiento__lt=timezone.now().date()
        ).count()
        
        # Tareas por prioridad
        por_prioridad = {
            'alta': tareas.filter(prioridad='A').count(),
            'media': tareas.filter(prioridad='M').count(),
            'baja': tareas.filter(prioridad='B').count(),
        }
        
        # Tareas próximas a vencer (en los próximos 7 días)
        fecha_limite = timezone.now().date() + timezone.timedelta(days=7)
        proximas_vencer = tareas.filter(
            completada=False,
            fecha_vencimiento__gte=timezone.now().date(),
            fecha_vencimiento__lte=fecha_limite
        ).count()
        
        return Response({
            'total': total,
            'completadas': completadas,
            'pendientes': pendientes,
            'vencidas': vencidas,
            'proximas_vencer': proximas_vencer,
            'por_prioridad': por_prioridad,
            'porcentaje_completadas': round((completadas / total * 100) if total > 0 else 0, 1)
        })

    # Endpoint para marcar múltiples tareas como completadas
    @action(detail=False, methods=['post'])
    def completar_multiples(self, request):
        ids = request.data.get('ids', [])
        if not ids:
            return Response(
                {'error': 'Se requiere una lista de IDs'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tareas = Tarea.objects.filter(id__in=ids, usuario=request.user)
        count = tareas.update(completada=True)
        
        return Response({
            'detail': f'{count} tarea(s) marcada(s) como completada(s)',
            'count': count
        })

    # Endpoint para eliminar tareas completadas
    @action(detail=False, methods=['delete'])
    def limpiar_completadas(self, request):
        tareas = Tarea.objects.filter(usuario=request.user, completada=True)
        count = tareas.count()
        tareas.delete()
        
        return Response({
            'detail': f'{count} tarea(s) completada(s) eliminada(s)',
            'count': count
        })

    # Endpoint para actualizar el orden de las tareas (Drag & Drop)
    @action(detail=False, methods=['post'])
    def reordenar(self, request):
        ordenes = request.data.get('ordenes', [])
        if not ordenes:
            return Response(
                {'error': 'Se requiere una lista de órdenes'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # ordenes debe ser una lista de objetos: [{'id': 1, 'orden': 0}, {'id': 2, 'orden': 1}, ...]
        try:
            for item in ordenes:
                tarea = Tarea.objects.get(id=item['id'], usuario=request.user)
                tarea.orden = item['orden']
                tarea.save(update_fields=['orden'])
            
            return Response({
                'detail': 'Orden actualizado correctamente',
                'count': len(ordenes)
            })
        except Tarea.DoesNotExist:
            return Response(
                {'error': 'Una o más tareas no existen'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    # Endpoint para generar link de compartición
    @action(detail=True, methods=['post'])
    def compartir(self, request, pk=None):
        tarea = self.get_object()
        token = tarea.generar_token_compartir()
        tarea.is_public = True
        tarea.save(update_fields=['is_public'])
        
        share_url = f"{request.scheme}://{request.get_host()}/compartido/{token}"
        
        return Response({
            'token': token,
            'share_url': share_url,
            'detail': 'Tarea compartida exitosamente'
        })

    # Endpoint para dejar de compartir
    @action(detail=True, methods=['post'])
    def dejar_compartir(self, request, pk=None):
        tarea = self.get_object()
        tarea.is_public = False
        tarea.save(update_fields=['is_public'])
        
        return Response({
            'detail': 'Tarea ya no es pública'
        })


# Vista pública para tareas compartidas (sin autenticación)
class TareaCompartidaView(APIView):
    permission_classes = []
    
    def get(self, request, token):
        try:
            tarea = Tarea.objects.get(share_token=token, is_public=True)
            serializer = TareaSerializer(tarea)
            return Response(serializer.data)
        except Tarea.DoesNotExist:
            return Response(
                {'error': 'Tarea no encontrada o no es pública'},
                status=status.HTTP_404_NOT_FOUND
            )


# --- Vistas de Autenticación ---

class UserLoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Usuario y contraseña son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user:
            if not user.is_active:
                return Response(
                    {'error': 'Esta cuenta ha sido desactivada'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            login(request, user)
            return Response({
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Credenciales inválidas'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class UserRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            
            return Response({
                'username': user.username,
                'email': user.email,
                'detail': 'Usuario registrado correctamente'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Sesión cerrada correctamente'}, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = []

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


# Vista para obtener el CSRF token
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = []

    def get(self, request):
        return Response({'detail': 'CSRF cookie set'}, status=status.HTTP_200_OK)