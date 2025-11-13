from rest_framework import generics, permissions, status # <-- 1. Adicione 'status'
from .models import Profile
from django.contrib.auth.models import User # <-- 1. Importe o User
from rest_framework.response import Response # <-- 1. Importe a Response
from rest_framework.views import APIView # <-- 1. Importe a APIView

# --- ✅ 1. IMPORTES ATUALIZADOS ---
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, ProfileUpdateSerializer, PasswordResetSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# ----------------------------------


# --- View de Login Customizada (EXISTENTE) ---
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --- View de Registro (EXISTENTE) ---
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# --- ✅ 2. ADICIONE ESTA NOVA CLASSE (Para GET e PATCH) ---
class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    API para o usuário logado ver (GET) e 
    atualizar (PATCH) seu próprio perfil.
    """
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated] # Só usuários logados

    def get_object(self):
        # Retorna o 'Profile' do usuário que está fazendo a requisição
        return self.request.user.profile
        
# --- ✅ 3. ADICIONE ESTA NOVA CLASSE (Para DELETE) ---
class UserDeleteView(APIView):
    """
    API para o usuário logado deletar sua própria conta (User e Profile).
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = self.request.user
        # Deleta o 'User'. O 'Profile' será deletado em cascata
        # (graças ao on_delete=models.CASCADE que definimos no models.py)
        user.delete()
        
        # Retorna uma resposta de sucesso sem conteúdo
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [permissions.AllowAny] # Qualquer um pode tentar recuperar

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # Troca a senha
            return Response(
                {"message": "Senha alterada com sucesso! Faça login com a nova senha."}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)