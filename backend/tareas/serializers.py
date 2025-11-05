from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Tarea, Etiqueta

class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = ['id', 'nombre', 'color', 'creada_en']
        read_only_fields = ['creada_en']

    def validate_nombre(self, value):
        """Valida que el nombre de la etiqueta sea único para el usuario"""
        user = self.context['request'].user
        if Etiqueta.objects.filter(nombre=value, usuario=user).exists():
            if not self.instance or self.instance.nombre != value:
                raise serializers.ValidationError("Ya tienes una etiqueta con este nombre")
        return value.strip()

    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class TareaSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')
    dias_restantes = serializers.SerializerMethodField()
    esta_vencida = serializers.SerializerMethodField()
    etiquetas = EtiquetaSerializer(many=True, read_only=True)
    etiquetas_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Tarea
        fields = [
            'id',
            'titulo',
            'descripcion',
            'completada',
            'prioridad',
            'fecha_vencimiento',
            'hora_vencimiento',
            'creada_en',
            'usuario',
            'dias_restantes',
            'esta_vencida',
            'etiquetas',
            'etiquetas_ids',
        ]
        read_only_fields = ['creada_en']

    def get_dias_restantes(self, obj):
        """Calcula los días restantes hasta la fecha de vencimiento"""
        if not obj.fecha_vencimiento or obj.completada:
            return None
        
        hoy = timezone.now().date()
        dias = (obj.fecha_vencimiento - hoy).days
        return dias

    def get_esta_vencida(self, obj):
        """Verifica si la tarea está vencida"""
        if not obj.fecha_vencimiento or obj.completada:
            return False
        
        return obj.fecha_vencimiento < timezone.now().date()

    def validate_titulo(self, value):
        """Valida que el título no esté vacío y tenga un mínimo de caracteres"""
        if not value or not value.strip():
            raise serializers.ValidationError("El título no puede estar vacío")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El título debe tener al menos 3 caracteres")
        
        if len(value) > 200:
            raise serializers.ValidationError("El título no puede exceder 200 caracteres")
        
        return value.strip()

    def validate_fecha_vencimiento(self, value):
        """Valida que la fecha de vencimiento no sea en el pasado"""
        if value:
            hoy = timezone.now().date()
            # Solo validar si es una tarea nueva o si se está cambiando la fecha
            if self.instance is None and value < hoy:
                raise serializers.ValidationError(
                    "La fecha de vencimiento no puede ser anterior a hoy"
                )
        return value

    def validate_prioridad(self, value):
        """Valida que la prioridad sea válida"""
        if value not in ['A', 'M', 'B']:
            raise serializers.ValidationError("Prioridad no válida. Debe ser A, M o B")
        return value

    def validate(self, data):
        """Validaciones a nivel de objeto"""
        # Si se marca como completada, validar que tenga todos los datos necesarios
        if data.get('completada'):
            # Solo validar titulo si es una creación o si se está actualizando el titulo
            titulo = data.get('titulo') or (self.instance.titulo if self.instance else None)
            if not titulo:
                raise serializers.ValidationError(
                    "No se puede completar una tarea sin título"
                )
        
        return data

    def create(self, validated_data):
        etiquetas_ids = validated_data.pop('etiquetas_ids', [])
        tarea = Tarea.objects.create(**validated_data)
        
        if etiquetas_ids:
            etiquetas = Etiqueta.objects.filter(
                id__in=etiquetas_ids,
                usuario=validated_data['usuario']
            )
            tarea.etiquetas.set(etiquetas)
        
        return tarea

    def update(self, instance, validated_data):
        etiquetas_ids = validated_data.pop('etiquetas_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if etiquetas_ids is not None:
            etiquetas = Etiqueta.objects.filter(
                id__in=etiquetas_ids,
                usuario=instance.usuario
            )
            instance.etiquetas.set(etiquetas)
        
        return instance


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_username(self, value):
        """Valida que el username sea único y válido"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso")
        
        if len(value) < 3:
            raise serializers.ValidationError("El nombre de usuario debe tener al menos 3 caracteres")
        
        if not value.isalnum() and '_' not in value:
            raise serializers.ValidationError(
                "El nombre de usuario solo puede contener letras, números y guiones bajos"
            )
        
        return value

    def validate_email(self, value):
        """Valida que el email sea único"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado")
        return value

    def validate(self, data):
        """Valida que las contraseñas coincidan"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden'
            })
        
        return data

    def create(self, validated_data):
        """Crea un nuevo usuario"""
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        
        return user