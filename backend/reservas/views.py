from rest_framework import generics, permissions
from .models import Reserva
from .serializers import ReservaSerializer

# Esta View permite Criar (POST) e Listar (GET) reservas
class ReservaListCreateView(generics.ListCreateAPIView):
    """
    API para criar uma nova reserva (POST) ou
    listar as reservas do usuário logado (GET).
    """
    serializer_class = ReservaSerializer
    
    # Apenas usuários logados podem ver ou criar reservas
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Sobrescrevemos este método para garantir que o usuário (GET)
        só veja as *suas próprias* reservas, e não as de todo mundo.
        """
        # Filtra as reservas onde o 'locatario' é o perfil do usuário logado
        return Reserva.objects.filter(locatario=self.request.user.profile).order_by('-data_inicio')

    def perform_create(self, serializer):
        """
        Sobrescrevemos este método (chamado durante o POST)
        para definir o 'locatario' automaticamente.
        O 'status' já é 'PENDENTE' por padrão (definido no models.py).
        """
        serializer.save(locatario=self.request.user.profile)