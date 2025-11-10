# piscinas/urls.py

from django.urls import path
from .views import PiscinaListCreateView

urlpatterns = [
    # Esta URL vai ser /api/piscinas/
    path('piscinas/', PiscinaListCreateView.as_view(), name='piscina-list-create'),
]