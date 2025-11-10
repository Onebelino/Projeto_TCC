from rest_framework import generics, permissions
from .serializers import RegisterSerializer

# --- 1. IMPORTE AS NOVAS FERRAMENTAS DO SIMPLE JWT ---
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Profile
# ----------------------------------------------------


# A view de Registro (que já tínhamos)
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# --- 2. CRIE O SERIALIZER DE TOKEN CUSTOMIZADO ---
# Este serializer vai "injetar" o tipo de usuário (LOCADOR/LOCATARIO)
# dentro do token JWT que o React recebe.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adicione dados customizados ao token
        # Buscamos o profile do usuário e colocamos o 'tipo' no token
        try:
            profile = Profile.objects.get(user=user)
            token['profile_tipo'] = profile.tipo
            token['username'] = user.username # Adiciona o username também
        except Profile.DoesNotExist:
            token['profile_tipo'] = None
            token['username'] = user.username

        return token

# --- 3. CRIE A VIEW DE TOKEN CUSTOMIZADA ---
# Esta é a View que o seu 'urls.py' estava tentando importar
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer