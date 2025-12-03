from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import validators
from datetime import date

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            profile = user.profile
            token['profile_tipo'] = profile.tipo
            token['display_name'] = profile.nome_completo or user.username
            token['profile_id'] = profile.id
            
        except Profile.DoesNotExist:
            token['profile_tipo'] = None
            token['display_name'] = user.username
            token['profile_id'] = None
        return token
# --------------------------------

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
            },
            'username': {'required': False}
        }
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Senhas não conferem.")
        return data

# --- Serializer de Registro (sem mudança) ---
class RegisterSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    tipo = serializers.ChoiceField(choices=Profile.TipoUsuario.choices)
    
    # --- ✅ Validação de Telefone Único ---
    telefone = serializers.CharField(
        required=True, 
        allow_blank=False, 
        max_length=20,
        validators=[
            validators.UniqueValidator(
                queryset=Profile.objects.all(),
                message="Este telefone já está cadastrado em outra conta."
            )
        ]
    )
    # --------------------------------------

    cpf = serializers.CharField(
        required=True, 
        allow_blank=False, 
        max_length=14,
        validators=[
            validators.UniqueValidator(
                queryset=Profile.objects.all(),
                message="Este CPF já está cadastrado em outra conta."
            )
        ]
    )
    nome_completo = serializers.CharField(required=True, allow_blank=False, max_length=255)
    data_nascimento = serializers.DateField(required=True)

    class Meta:
        model = Profile
        fields = [ 'user', 'tipo', 'telefone', 'cpf', 'nome_completo', 'data_nascimento' ]

    def validate_cpf(self, value):
        if not value: return value
        from validate_docbr import CPF
        cpf_validator = CPF()
        if not cpf_validator.validate(value):
            raise serializers.ValidationError("Este CPF não é válido.")
        return value

    def validate_data_nascimento(self, value):
        if not value: return value
        hoje = date.today()
        idade = hoje.year - value.year - ((hoje.month, hoje.day) < (value.month, value.day))
        if idade < 18:
            raise serializers.ValidationError("Você deve ter pelo menos 18 anos para se registrar.")
        return value

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

# --- Serializer de Edição de Perfil (sem mudança) ---
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['nome_completo', 'data_nascimento', 'telefone']
        extra_kwargs = {
            'nome_completo': {'required': False},
            'data_nascimento': {'required': False},
            'telefone': {'required': False},
        }

# --- Serializer de Reset de Senha (sem mudança) ---
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    cpf = serializers.CharField(required=True, max_length=14)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("As novas senhas não conferem.")
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Nenhum usuário encontrado com este e-mail.")
        if not hasattr(user, 'profile'):
             raise serializers.ValidationError("Este usuário não possui um perfil completo.")
        if user.profile.cpf != data['cpf']:
            raise serializers.ValidationError("O CPF informado não corresponde a este e-mail.")
        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user