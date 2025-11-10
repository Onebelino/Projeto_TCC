from django.urls import path
from .views import ReservaListCreateView

urlpatterns = [
    # A URL será /api/reservas/
    path('reservas/', ReservaListCreateView.as_view(), name='reserva-list-create'),
    
    # (No futuro, podemos adicionar /api/reservas/<id>/ para cancelar)
]