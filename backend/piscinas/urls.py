from django.urls import path
# --- ✅ 1. Importe a nova View ---
from .views import (
    PiscinaListCreateView, 
    PiscinaRetrieveView,
    LocadorPiscinaListView 
)

urlpatterns = [
    # GET (Público) / POST (Locador)
    path('piscinas/', PiscinaListCreateView.as_view(), name='piscina-list-create'),
    
    # GET (Público) / PATCH (Dono) / DELETE (Dono)
    path('piscinas/<int:pk>/', PiscinaRetrieveView.as_view(), name='piscina-detail'),

    # --- ✅ 2. ADICIONE A NOVA ROTA ---
    # GET (Locador) - Lista apenas as piscinas do locador logado
    path('locador/piscinas/', LocadorPiscinaListView.as_view(), name='locador-piscina-list'),
]