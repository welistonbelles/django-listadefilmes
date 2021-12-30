from rest_framework import viewsets, status
from rest_framework.response import Response

from django.views.generic import TemplateView

from .serializers import MovieSerializer
from .models import Movie

class IndexView(TemplateView):
    template_name = 'index.html'

    """def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['movies'] = Movie.objects.all()
        return  context"""

class ApiView(TemplateView):
    template_name = 'api.html'

class MovieView(viewsets.ViewSet):
    def list(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = MovieSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        movie = Movie.objects.get(id=pk)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)

    def update(self, request, pk=None):
        movie = Movie.objects.get(id=pk)
        serializer = MovieSerializer(instance=movie, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def destroy(self, request, pk=None):
        movie = Movie.objects.get(id=pk)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)