from rest_framework import generics, permissions
from .models import Piscina
from .serializers import PiscinaSerializer
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsDonodaPiscina # <-- 1. Importe o "Segurança"

# --- Permissão de Locador (que já tínhamos) ---
class IsLocador(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.tipo == 'LOCADOR'

# --- View de Lista/Criação (sem mudança) ---
class PiscinaListCreateView(generics.ListCreateAPIView):
    queryset = Piscina.objects.all()
    serializer_class = PiscinaSerializer
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['titulo', 'cidade', 'descricao']
    filterset_fields = ['estado']
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsLocador()]

    def perform_create(self, serializer):
        serializer.save(dono=self.request.user.profile)

# --- View de Detalhes/Update/Delete (sem mudança) ---
class PiscinaRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Piscina.objects.all()
    serializer_class = PiscinaSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        # Só o Dono pode Atualizar (PATCH) ou Excluir (DELETE)
        return [permissions.IsAuthenticated(), IsDonodaPiscina()]

# --- ✅ 2. ADICIONE ESTA NOVA CLASSE NO FINAL ---
class LocadorPiscinaListView(generics.ListAPIView):
    """
    API para o Locador ver (GET) uma lista
    apenas das SUAS próprias piscinas.
    """
    serializer_class = PiscinaSerializer
    permission_classes = [permissions.IsAuthenticated, IsLocador] # Só Locadores

    def get_queryset(self):
        """
        Filtra o queryset para retornar apenas
        as piscinas do usuário logado.
        """
        # (request.user.profile) é o perfil do locador logado
        return Piscina.objects.filter(dono=self.request.user.profile).order_by('-id')