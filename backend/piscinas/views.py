# piscinas/views.py

from rest_framework import generics, permissions
from .models import Piscina
from .serializers import PiscinaSerializer

# Vamos criar uma "permissão" customizada
# para checar se o usuário é um LOCADOR
class IsLocador(permissions.BasePermission):
    def has_permission(self, request, view):
        # O usuário está logado E o tipo do perfil dele é LOCADOR?
        return request.user.is_authenticated and request.user.profile.tipo == 'LOCADOR'

# API para LISTAR todas as piscinas (GET) e CRIAR uma nova (POST)
class PiscinaListCreateView(generics.ListCreateAPIView):
    queryset = Piscina.objects.all()
    serializer_class = PiscinaSerializer
    filterset_fields = ['cidade']
    
    def get_permissions(self):
        # Se o método for GET (listar), qualquer um pode ver (AllowAny)
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        
        # Se for POST (criar), exigimos que seja um LOCADOR (IsLocador)
        return [IsLocador()]

    # Este método é chamado QUANDO uma piscina está sendo CRIADA
    def perform_create(self, serializer):
        # Salvamos a piscina associando o 'dono' 
        # ao perfil do usuário que está logado (request.user.profile)
        serializer.save(dono=self.request.user.profile)