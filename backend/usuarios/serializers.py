from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import validators

# --- ✅ ESTE É O SERIALIZER DE TOKEN CORRETO ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            profile = user.profile
            token['profile_tipo'] = profile.tipo
            
            # --- A LÓGICA QUE ESTAVA FALTANDO ---
            # Ele adiciona 'display_name' (Nome Completo)
            token['display_name'] = profile.nome_completo or user.username
            # ------------------------------------

        except Profile.DoesNotExist:
            token['profile_tipo'] = None
            token['display_name'] = user.username # Fallback
        return token

# --- Serializer de Usuário (corrigido para 'username' não ser obrigatório) ---
class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {
                'required': True,
                'validators': [
                    validators.UniqueValidator(
                        queryset=User.objects.all(),
                        message="Este e-mail já está em uso."
                    )
                ]
            },
            'username': {'required': False} # Permite que o 'create' o preencha
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Senhas não conferem.")
        return data

# --- Serializer de Registro (corrigido para 'username' ser o 'email') ---
class RegisterSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    
    tipo = serializers.ChoiceField(choices=Profile.TipoUsuario.choices)
    telefone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    cpf = serializers.CharField(required=False, allow_blank=True, max_length=14)
    nome_completo = serializers.CharField(required=True, allow_blank=False, max_length=255)
    data_nascimento = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = [
            'user', 
            'tipo', 
            'telefone', 
            'cpf',
            'nome_completo',
            'data_nascimento'
        ]

    # Validação do CPF (sem mudança)
    def validate_cpf(self, value):
        if not value:
            return value
        from validate_docbr import CPF
        cpf_validator = CPF()
        if not cpf_validator.validate(value):
            raise serializers.ValidationError("Este CPF não é válido.")
        return value

    # 'create' que copia o e-mail para o username (sem mudança)
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        
        tipo_usuario = validated_data.pop('tipo')
        telefone = validated_data.pop('telefone', None)
        cpf = validated_data.pop('cpf', None)
        nome_completo = validated_data.pop('nome_completo', None)
        data_nascimento = validated_data.pop('data_nascimento', None)
        
        username = user_data['email']
        
        user = User.objects.create_user(
            username=username, 
            email=user_data['email'],
            password=user_data['password']
        )
        
        profile = Profile.objects.create(
            user=user,
            tipo=tipo_usuario,
            telefone=telefone,
            cpf=cpf,
            nome_completo=nome_completo,
            data_nascimento=data_nascimento
        )
        return profile