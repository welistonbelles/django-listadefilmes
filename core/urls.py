from django.urls import path
from .views import IndexView, MovieView, ApiView


urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('api/', ApiView.as_view(), name="api"),
    path('api/movies', MovieView.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('api/movies/<str:pk>', MovieView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }))
]