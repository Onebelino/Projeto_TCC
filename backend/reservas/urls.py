from django.urls import path
# --- ✅ Imports atualizados ---
from .views import (
    ReservaListCreateView, 
    ReservaManageView, 
    LocadorReservasListView,
    ReservaCancelView # <-- Nova importação
)

urlpatterns = [
    # (Rotas existentes)
    path('reservas/', ReservaListCreateView.as_view(), name='reserva-list-create'),
    path('reservas/<int:pk>/manage/', ReservaManageView.as_view(), name='reserva-manage'),
    path('locador/reservas/', LocadorReservasListView.as_view(), name='locador-reservas-list'),

    # --- ✅ ADICIONE ESTA NOVA ROTA NO FINAL ---
    # /api/reservas/5/cancel/ (Para o Locatário CANCELAR a reserva 5)
    path('reservas/<int:pk>/cancel/', ReservaCancelView.as_view(), name='reserva-cancel'),
]