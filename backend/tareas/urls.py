from rest_framework.routers import DefaultRouter
from .views import TareaViewSet

router = DefaultRouter()

router.register(r'tareas', TareaViewSet, basename='tareas')

urlpatterns = router.urls