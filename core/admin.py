from django.contrib import admin

from .models import Movie

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'description', 'slug', 'criado', 'modificado', 'ativo')

