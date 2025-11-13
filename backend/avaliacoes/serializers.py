from rest_framework import serializers
from .models import Avaliacao

class AvaliacaoSerializer(serializers.ModelSerializer):
    autor_nome = serializers.CharField(source='autor.nome_completo', read_only=True)

    class Meta:
        model = Avaliacao
        # Adicionamos 'resposta'
        fields = ['id', 'piscina', 'autor', 'autor_nome', 'nota', 'comentario', 'resposta', 'criado_em']
        read_only_fields = ['autor', 'resposta'] # O locatário não pode escrever a resposta aqui

# --- ✅ NOVO SERIALIZER PARA A RESPOSTA ---
class AvaliacaoRespostaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = ['resposta'] # Só permite alterar a resposta