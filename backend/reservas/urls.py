from django.urls import path
# --- ✅ Imports atualizados ---
from .views import ReservaListCreateView, ReservaManageView, LocadorReservasListView

urlpatterns = [
    # /api/reservas/ (Para o Locatário criar ou ver as SUAS reservas)
    path('reservas/', ReservaListCreateView.as_view(), name='reserva-list-create'),
    
    # /api/reservas/5/manage/ (Para o Locador ACEITAR/RECUSAR a reserva 5)
    path('reservas/<int:pk>/manage/', ReservaManageView.as_view(), name='reserva-manage'),

    # --- ✅ ADICIONE ESTA NOVA ROTA NO FINAL ---
    # /api/locador/reservas/ (Para o Locador ver o "Painel" de todas as suas reservas)
    path('locador/reservas/', LocadorReservasListView.as_view(), name='locador-reservas-list'),
]