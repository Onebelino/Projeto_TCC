# usuarios/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

# Importe o serializer de token original
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- ✅ CÓDIGO NOVO AQUI ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customiza o "payload" (conteúdo) do token JWT.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adiciona dados customizados
        # Agora o token vai carregar o username E o tipo de perfil
        token['username'] = user.username
        
        # Tenta pegar o perfil. Se não tiver, define como 'None'
        try:
            profile = user.profile
            token['profile_tipo'] = profile.tipo
        except Profile.DoesNotExist:
            token['profile_tipo'] = None

        return token
# --- FIM DO CÓDIGO NOVO ---


class UserSerializer(serializers.ModelSerializer):
    # ... (O resto do arquivo continua igual) ...
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    # ... (etc) ...

class RegisterSerializer(serializers.ModelSerializer):
    # ... (O resto do RegisterSerializer continua igual) ...
    user = UserSerializer(required=True)
    tipo = serializers.ChoiceField(choices=Profile.TipoUsuario.choices)
    telefone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    cpf = serializers.CharField(required=False, allow_blank=True, max_length=14)

    class Meta:
        model = Profile
        fields = ['user', 'tipo', 'telefone', 'cpf']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        tipo_usuario = validated_data.pop('tipo')
        telefone = validated_data.pop('telefone', None)
        cpf = validated_data.pop('cpf', None)

        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password']
        )
        
        profile = Profile.objects.create(
            user=user,
            tipo=tipo_usuario,
            telefone=telefone,
            cpf=cpf
        )
        return profile