from rest_framework import serializers
from .models import Piscina, PiscinaImagem # <-- 1. Importe o novo modelo
from reservas.models import Reserva

# --- Mini-Serializer para o Calendário (sem mudança) ---
class ReservasParaCalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ['data_inicio', 'data_fim', 'status']

# --- ✅ NOVO Mini-Serializer para as Imagens ---
class PiscinaImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PiscinaImagem
        fields = ['id', 'imagem'] # Vamos retornar o ID e a URL da imagem

# --- Serializer Principal da Piscina (ATUALIZADO) ---
class PiscinaSerializer(serializers.ModelSerializer):
    
    dono_telefone = serializers.CharField(source='dono.telefone', read_only=True)
    reservas = ReservasParaCalendarioSerializer(many=True, read_only=True)
    
    # --- ✅ ATUALIZAÇÃO DO CARROSSEL ---
    # 1. 'imagens' vai ser a nossa lista de URLs de imagem
    imagens = PiscinaImagemSerializer(many=True, read_only=True)
    
    # 2. 'upload_imagens' é um campo "só de escrita" (write_only)
    # O React vai enviar os arquivos neste campo
    upload_imagens = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        required=False # Torna o envio de fotos opcional
    )
    
    class Meta:
        model = Piscina
        fields = [
            'id', 
            'dono', 
            'titulo', 
            'descricao', 
            'cidade', 
            'endereco', 
            'preco_diaria',
            'dono_telefone',
            'reservas',
            'imagens', # <-- O que a API "lê" (o carrossel)
            'upload_imagens' # <-- O que a API "escreve" (o upload)
        ]
        read_only_fields = ['dono']

    # --- ✅ NOVA LÓGICA DE 'CREATE' ---
    # Sobrescrevemos o 'create' para salvar as imagens
    def create(self, validated_data):
        # 1. Pega os arquivos de imagem que o React enviou
        # Usamos .pop() para remover da lista, pois não é um campo do 'Piscina'
        imagens_data = validated_data.pop('upload_imagens', [])
        
        # 2. Cria a 'Piscina' (com os dados que sobraram)
        piscina = Piscina.objects.create(**validated_data)

        # 3. Faz um loop e cria cada 'PiscinaImagem'
        for imagem_data in imagens_data:
            PiscinaImagem.objects.create(piscina=piscina, imagem=imagem_data)
            
        return piscina