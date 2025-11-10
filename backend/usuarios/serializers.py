from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import validators

# --- ✅ 1. IMPORTAMOS A BIBLIOTECA DE CPF ---
from validate_docbr import CPF

# --- Serializer de Token Customizado (sem mudança) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            profile = user.profile
            token['profile_tipo'] = profile.tipo
            token['username'] = user.username
        except Profile.DoesNotExist:
            token['profile_tipo'] = None
            token['username'] = user.username
        return token

# --- Serializer de Usuário (sem mudança) ---
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
            }
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Senhas não conferem.")
        return data

# --- Serializer de Registro (ATUALIZADO) ---
class RegisterSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    
    tipo = serializers.ChoiceField(choices=Profile.TipoUsuario.choices)
    telefone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    cpf = serializers.CharField(required=False, allow_blank=True, max_length=14)
    nome_completo = serializers.CharField(required=False, allow_blank=True, max_length=255)
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

    # --- ✅ 2. ADICIONAMOS A FUNÇÃO DE VALIDAÇÃO ---
    def validate_cpf(self, value):
        """
        Esta função é chamada automaticamente pelo Django
        APENAS para o campo 'cpf'.
        """
        # Se o CPF estiver vazio, não valide (permite campos em branco)
        if not value:
            return value
        
        cpf_validator = CPF()
        
        # A biblioteca 'validate' retorna True se for válido, False se não for
        if not cpf_validator.validate(value):
            # Se for Falso, levante um erro que o React vai receber
            raise serializers.ValidationError("Este CPF não é válido.")
        
        # Opcional: Limpar a máscara (ex: 123.456.789-00 -> 12345678900)
        # return cpf_validator.mask(value) # Ou apenas retorne o valor limpo
        
        return value # Retorna o CPF original (com máscara) se for válido

    # --- (A função 'create' continua a mesma de antes) ---
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        
        tipo_usuario = validated_data.pop('tipo')
        telefone = validated_data.pop('telefone', None)
        cpf = validated_data.pop('cpf', None)
        nome_completo = validated_data.pop('nome_completo', None)
        data_nascimento = validated_data.pop('data_nascimento', None)
        
        user = User.objects.create_user(
            username=user_data['username'],
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