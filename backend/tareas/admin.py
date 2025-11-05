from django.contrib import admin
from .models import Tarea, Etiqueta

@admin.register(Etiqueta)
class EtiquetaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'color', 'usuario', 'creada_en']
    list_filter = ['usuario', 'creada_en']
    search_fields = ['nombre', 'usuario__username']
    readonly_fields = ['creada_en']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(usuario=request.user)
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.usuario = request.user
        super().save_model(request, obj, form, change)


@admin.register(Tarea)
class TareaAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'usuario', 'prioridad', 'completada', 'fecha_vencimiento', 'hora_vencimiento', 'esta_vencida', 'creada_en']
    list_filter = ['completada', 'prioridad', 'fecha_vencimiento', 'creada_en', 'etiquetas']
    search_fields = ['titulo', 'descripcion', 'usuario__username']
    list_editable = ['completada', 'prioridad']
    readonly_fields = ['creada_en', 'actualizada_en', 'esta_vencida', 'dias_restantes']
    filter_horizontal = ['etiquetas']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('usuario', 'titulo', 'descripcion')
        }),
        ('Estado y Prioridad', {
            'fields': ('completada', 'prioridad', 'fecha_vencimiento', 'hora_vencimiento')
        }),
        ('Etiquetas', {
            'fields': ('etiquetas',)
        }),
        ('Información del Sistema', {
            'fields': ('creada_en', 'actualizada_en', 'esta_vencida', 'dias_restantes'),
            'classes': ('collapse',)
        }),
    )
    
    def esta_vencida(self, obj):
        return obj.esta_vencida
    esta_vencida.boolean = True
    esta_vencida.short_description = '¿Vencida?'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(usuario=request.user)
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si es una nueva tarea
            obj.usuario = request.user
        super().save_model(request, obj, form, change)
