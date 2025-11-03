# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include  # <-- 'include' es fundamental

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 1. Conecta con las URLs de tu app 'tareas' (para api/tareas/)
    path('api/', include('tareas.urls')),
    
    # 2. Agrega el login/logout para la API navegable de DRF
    path('api-auth/', include('rest_framework.urls')),
]