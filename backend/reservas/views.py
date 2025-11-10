from rest_framework import generics, permissions
from .models import Reserva
# --- ✅ Imports atualizados ---
from .serializers import ReservaSerializer, ReservaStatusUpdateSerializer, ReservaCancelSerializer
from .permissions import IsDonodaPiscinaDaReserva, IsLocatarioDaReserva 
# ----------------------------

# --- VIEW 1 (EXISTENTE) ---
class ReservaListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Reserva.objects.filter(locatario=self.request.user.profile).order_by('-data_inicio')
    def perform_create(self, serializer):
        serializer.save(locatario=self.request.user.profile)

# --- VIEW 2 (EXISTENTE) ---
class ReservaManageView(generics.UpdateAPIView):
    serializer_class = ReservaStatusUpdateSerializer
    queryset = Reserva.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsDonodaPiscinaDaReserva]
    
# --- VIEW 3 (EXISTENTE) ---
class LocadorReservasListView(generics.ListAPIView):
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        locador_profile = self.request.user.profile
        return Reserva.objects.filter(piscina__dono=locador_profile).order_by('-criado_em')

# --- ✅ ADICIONE ESTA NOVA CLASSE NO FINAL DO ARQUIVO ---
class ReservaCancelView(generics.UpdateAPIView):
    """
    API para o Locatário (dono da reserva) cancelar sua própria reserva.
    Usa o método PATCH.
    """
    serializer_class = ReservaCancelSerializer # O novo serializer de cancelamento
    queryset = Reserva.objects.all()
    
    # Segurança: Precisa estar logado E ser o locatário (dono) da reserva
    permission_classes = [permissions.IsAuthenticated, IsLocatarioDaReserva]