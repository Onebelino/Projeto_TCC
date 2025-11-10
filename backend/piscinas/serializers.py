from rest_framework import serializers
from .models import Piscina

class PiscinaSerializer(serializers.ModelSerializer):
    
    # --- 1. A PONTE PARA O TELEFONE ---
    # Esta linha "pula" do modelo Piscina -> Profile (dono) -> telefone
    # Ela cria o campo "dono_telefone" no nosso JSON
    dono_telefone = serializers.CharField(source='dono.telefone', read_only=True)
    
    # O campo 'imagem' será tratado automaticamente pelo ModelSerializer
    # O campo 'preco_diaria' também.

    class Meta:
        model = Piscina
        
        # --- 2. A LISTA DE CAMPOS ---
        # Certifique-se que 'imagem', 'preco_diaria' e 'dono_telefone'
        # estão TODOS na lista de fields:
        fields = [
            'id', 
            'dono', 
            'titulo', 
            'descricao', 
            'cidade', 
            'endereco', 
            'preco_diaria',  # <-- Campo de Preço
            'imagem',        # <-- Campo de Imagem
            'dono_telefone'  # <-- Campo de Telefone (da linha 8)
        ]
        
        # O 'dono' é definido pelo backend (usuário logado), não pelo frontend
        read_only_fields = ['dono']