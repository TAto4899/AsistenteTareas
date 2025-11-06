from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

#Opciones para el campo de prioridad

PRIORITY_CHOICE = (
    ('B', 'Baja'),
    ('M', 'Media'),
    ('A', 'Alta'),
)

class Etiqueta(models.Model):
    """Modelo para etiquetas/tags de tareas"""
    nombre = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#2196F3')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='etiquetas')
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Etiqueta'
        verbose_name_plural = 'Etiquetas'
        unique_together = ['nombre', 'usuario']

    def __str__(self):
        return self.nombre


class Tarea(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tareas')

    titulo = models.CharField(max_length=200)

    descripcion = models.TextField(blank=True)

    completada = models.BooleanField(default=False)

    prioridad = models.CharField(
        max_length=1,
        choices=PRIORITY_CHOICE,
        default='M'
    )

    fecha_vencimiento = models.DateField(null=True, blank=True)
    
    hora_vencimiento = models.TimeField(null=True, blank=True)
    
    orden = models.IntegerField(default=0, help_text='Orden personalizado del usuario')

    creada_en = models.DateTimeField(auto_now_add=True)
    
    actualizada_en = models.DateTimeField(auto_now=True)
    
    etiquetas = models.ManyToManyField(Etiqueta, blank=True, related_name='tareas')

    class Meta:
        ordering = ['orden', '-creada_en']
        verbose_name = 'Tarea'
        verbose_name_plural = 'Tareas'
        indexes = [
            models.Index(fields=['usuario', 'orden', '-creada_en']),
            models.Index(fields=['usuario', 'completada']),
            models.Index(fields=['usuario', 'prioridad']),
        ]

    def __str__(self):
        return f"{self.titulo} - {self.get_prioridad_display()}"

    @property
    def esta_vencida(self):
        """Verifica si la tarea está vencida"""
        if not self.fecha_vencimiento or self.completada:
            return False
        return self.fecha_vencimiento < timezone.now().date()

    @property
    def dias_restantes(self):
        """Calcula los días restantes hasta la fecha de vencimiento"""
        if not self.fecha_vencimiento or self.completada:
            return None
        hoy = timezone.now().date()
        return (self.fecha_vencimiento - hoy).days

    def marcar_completada(self):
        """Marca la tarea como completada"""
        self.completada = True
        self.save()

    def marcar_pendiente(self):
        """Marca la tarea como pendiente"""
        self.completada = False
        self.save()
