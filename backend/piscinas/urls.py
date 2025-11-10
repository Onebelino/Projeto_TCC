from django.urls import path
# --- ✅ Imports atualizados ---
from .views import PiscinaListCreateView, PiscinaRetrieveView

urlpatterns = [
    # Esta rota já existia (GET para listar, POST para criar)
    # /api/piscinas/
    path('piscinas/', PiscinaListCreateView.as_view(), name='piscina-list-create'),

    # --- ✅ ADICIONE ESTA NOVA ROTA NO FINAL ---
    # Esta rota é para ver os detalhes de UMA piscina
    # ex: /api/piscinas/7/
    path('piscinas/<int:pk>/', PiscinaRetrieveView.as_view(), name='piscina-detail'),
]