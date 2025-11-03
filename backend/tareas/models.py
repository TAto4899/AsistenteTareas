from django.db import models
from django.contrib.auth.models import User

#Opciones para el campo de prioridad

PRIORITY_CHOICE = (
    ('B', 'Baja'),
    ('M', 'Media'),
    ('A', 'Alta'),
)

class Tarea(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    titulo = models.CharField(max_length=200)

    descripcion = models.TextField(blank=True)

    completada = models.BooleanField(default=False)

    prioridad = models.CharField(
        max_length=1,
        choices=PRIORITY_CHOICE,
        default='M'
    )


    fecha_vencimiento = models.DateField(null=True, blank=True)

    creada_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
