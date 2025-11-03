from rest_framework import serializers
from .models import Tarea

class TareaSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Tarea

        fields = [
            'id',
            'titulo',
            'descripcion',
            'completada',
            'prioridad',
            'fecha_vencimiento',
            'creada_en',
            'usuario',
        ]