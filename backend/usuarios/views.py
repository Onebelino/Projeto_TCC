from rest_framework import generics, permissions

# --- ✅ 1. IMPORTAMOS O SERIALIZER CORRETO (DO ARQUIVO CERTO) ---
# O 'MyTokenObtainPairSerializer' é importado do 'serializers.py'
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# ---------------------------------------------------

# --- ✅ 2. A VIEW DE LOGIN CUSTOMIZADA ---
# Esta é a classe que o seu 'urls.py' está (corretamente) usando
class MyTokenObtainPairView(TokenObtainPairView):
    """
    Esta View "diz" ao Django para usar o nosso Serializer customizado
    (o que adiciona o 'display_name' e 'profile_tipo' ao token).
    """
    serializer_class = MyTokenObtainPairSerializer
# ---------------------------------------------------

# --- Esta é a sua View de Registro (sem mudança) ---
class RegisterView(generics.CreateAPIView):
    """
    API para registrar novos usuários (Locadores ou Locatários).
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
# ---------------------------------------------------