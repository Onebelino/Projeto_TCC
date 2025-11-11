from rest_framework import serializers
from .models import Piscina, PiscinaImagem 
from reservas.models import Reserva

# --- Mini-Serializers (sem mudança) ---
class ReservasParaCalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ['data_inicio', 'data_fim', 'status']

class PiscinaImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PiscinaImagem
        fields = ['id', 'imagem']

# --- Serializer Principal da Piscina (ATUALIZADO) ---
class PiscinaSerializer(serializers.ModelSerializer):
    
    dono_telefone = serializers.CharField(source='dono.telefone', read_only=True)
    reservas = ReservasParaCalendarioSerializer(many=True, read_only=True)
    imagens = PiscinaImagemSerializer(many=True, read_only=True)
    upload_imagens = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Piscina
        fields = [
            'id', 
            'dono', 
            'titulo', 
            'descricao', 
            'cidade', 
            'estado', 
            'endereco', 
            'preco_diaria',
            'dono_telefone',
            'reservas',
            'imagens', 
            'upload_imagens'
        ]
        read_only_fields = ['dono']

    # Lógica de 'create' (sem mudança)
    def create(self, validated_data):
        imagens_data = validated_data.pop('upload_imagens', [])
        piscina = Piscina.objects.create(**validated_data)
        for imagem_data in imagens_data:
            PiscinaImagem.objects.create(piscina=piscina, imagem=imagem_data)
        return piscina

    # --- ✅ A CORREÇÃO ESTÁ AQUI ---
    # Adicionamos a lógica de 'update'
    def update(self, instance, validated_data):
        """
        Lida com a atualização (PATCH) de uma piscina.
        """
        # 1. Remove o campo de upload de imagens (não vamos atualizar imagens
        #    neste endpoint, apenas os dados de texto/preço)
        validated_data.pop('upload_imagens', None) # 'None' para não quebrar se ele não existir
        
        # 2. Chama a lógica de 'update' padrão do ModelSerializer
        #    para salvar os outros campos (ex: 'titulo', 'preco_diaria')
        return super().update(instance, validated_data)
    # ---------------------------------