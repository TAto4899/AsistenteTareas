# backend/tareas/urls.py

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    TareaViewSet,
    EtiquetaViewSet,
    UserLoginView, 
    UserLogoutView, 
    CurrentUserView, 
    GetCSRFToken,
    UserRegisterView
)

router = DefaultRouter()
router.register(r'tareas', TareaViewSet, basename='tareas')
router.register(r'etiquetas', EtiquetaViewSet, basename='etiquetas')

urlpatterns = [
    path('csrf/', GetCSRFToken.as_view(), name='csrf'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('register/', UserRegisterView.as_view(), name='register'),
    path('user/', CurrentUserView.as_view(), name='user'),
]

urlpatterns += router.urls