from rest_framework import generics, permissions
from .models import Reserva
# Imports atualizados:
from .serializers import ReservaSerializer, ReservaStatusUpdateSerializer
from .permissions import IsDonodaPiscinaDaReserva 

# --- A 'ReservaListCreateView' (que já fizemos) FICA AQUI ---
class ReservaListCreateView(generics.ListCreateAPIView):
    """
    API para o Locatário criar (POST) ou
    listar as SUAS reservas (GET).
    """
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Mostra ao LOCATÁRIO apenas as *suas* reservas.
        """
        return Reserva.objects.filter(locatario=self.request.user.profile).order_by('-data_inicio')

    def perform_create(self, serializer):
        """
        Define o 'locatario' da reserva como o usuário logado.
        """
        serializer.save(locatario=self.request.user.profile)


# --- A 'ReservaManageView' (que já fizemos) FICA AQUI ---
class ReservaManageView(generics.UpdateAPIView):
    """
    API para o Locador (Dono da Piscina) gerenciar uma reserva (Aceitar/Recusar).
    Usa o método PATCH.
    """
    serializer_class = ReservaStatusUpdateSerializer
    queryset = Reserva.objects.all()
    
    # Segurança: Precisa estar logado E ser o dono da piscina da reserva
    permission_classes = [permissions.IsAuthenticated, IsDonodaPiscinaDaReserva]
    

# --- ✅ ADICIONE ESTA NOVA CLASSE NO FINAL DO ARQUIVO ---
class LocadorReservasListView(generics.ListAPIView):
    """
    API para o Locador (Dono) ver TODAS as reservas
    associadas às SUAS piscinas.
    """
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated] # Só usuários logados

    def get_queryset(self):
        """
        Sobrescrevemos este método para filtrar as reservas.
        """
        # 1. Pega o perfil do usuário logado (que é o Locador)
        locador_profile = self.request.user.profile

        # 2. Filtra as reservas onde a 'piscina' pertence (dono)
        #    a este 'locador_profile'
        return Reserva.objects.filter(piscina__dono=locador_profile).order_by('-criado_em')