from rest_framework import generics, permissions
from .models import Piscina
from .serializers import PiscinaSerializer
from rest_framework.parsers import MultiPartParser, FormParser # <-- ✅ 1. Importe os Parsers

# --- Permissão (que já tínhamos) ---
class IsLocador(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.tipo == 'LOCADOR'

# --- View de Lista/Criação (ATUALIZADA) ---
class PiscinaListCreateView(generics.ListCreateAPIView):
    queryset = Piscina.objects.all()
    serializer_class = PiscinaSerializer
    
    # --- ✅ 2. ADICIONE OS PARSERS ---
    # Diz ao Django para esperar 'multipart/form-data' (dados de formulário + arquivos)
    parser_classes = [MultiPartParser, FormParser]

    # Filtro (que já tínhamos)
    filterset_fields = ['cidade'] 
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsLocador()]

    def perform_create(self, serializer):
        # A lógica de salvar as imagens agora está no Serializer (create)
        # Então, só precisamos salvar o 'dono' aqui
        serializer.save(dono=self.request.user.profile)


# --- View de Detalhes (sem mudança) ---
class PiscinaRetrieveView(generics.RetrieveAPIView):
    """
    API para buscar (GET) os detalhes de UMA piscina específica.
    """
    queryset = Piscina.objects.all()
    serializer_class = PiscinaSerializer
    permission_classes = [permissions.AllowAny]