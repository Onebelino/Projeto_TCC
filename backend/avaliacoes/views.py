from rest_framework import generics, permissions
from .models import Avaliacao
from .serializers import AvaliacaoSerializer, AvaliacaoRespostaSerializer
from .permissions import PodeAvaliarPiscina, IsDonoDaPiscinaDaAvaliacao
from django_filters.rest_framework import DjangoFilterBackend

class AvaliacaoListCreateView(generics.ListCreateAPIView):
    queryset = Avaliacao.objects.all().order_by('-criado_em')
    serializer_class = AvaliacaoSerializer
    permission_classes = [PodeAvaliarPiscina]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['piscina']

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user.profile)

# --- ✅ NOVA VIEW PARA RESPONDER ---
class AvaliacaoRespostaView(generics.UpdateAPIView):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoRespostaSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonoDaPiscinaDaAvaliacao]
    http_method_names = ['patch'] # Apenas atualização parcial