from rest_framework import serializers
from .models import Reserva
import datetime

class ReservaSerializer(serializers.ModelSerializer):
    
    # Vamos "enriquecer" o JSON de resposta para mostrar o nome do locatário
    # (Não é obrigatório, mas ajuda no frontend)
    locatario_username = serializers.CharField(source='locatario.user.username', read_only=True)

    class Meta:
        model = Reserva
        
        # 'piscina', 'data_inicio', 'data_fim', 'preco_total' são enviados pelo React
        # 'locatario' e 'status' são definidos pelo servidor (backend)
        fields = [
            'id', 
            'piscina', 
            'locatario', 
            'locatario_username', 
            'data_inicio', 
            'data_fim', 
            'preco_total', 
            'status', 
            'criado_em'
        ]
        
        # O usuário não pode "forçar" um status ou dizer quem ele é
        read_only_fields = ['locatario', 'status', 'locatario_username']

    # Validação (Regras de Negócio)
    def validate(self, data):
        # 1. A data final não pode ser antes da inicial
        if data['data_inicio'] > data['data_fim']:
            raise serializers.ValidationError("A data final deve ser depois da data inicial.")
        
        # 2. A data inicial não pode ser no passado
        if data['data_inicio'] < datetime.date.today():
             raise serializers.ValidationError("Não é possível agendar datas no passado.")

        # 3. (Mais importante) Lógica anti-colisão
        # Verifica se JÁ EXISTE uma reserva (Confirmada ou Pendente) para esta piscina nestas datas
        
        # Procura por reservas que:
        # 1. Começam *antes* da data final solicitada E
        # 2. Terminam *depois* da data inicial solicitada
        reservas_existentes = Reserva.objects.filter(
            piscina=data['piscina'],
            status__in=[Reserva.StatusReserva.PENDENTE, Reserva.StatusReserva.CONFIRMADA],
            data_inicio__lte=data['data_fim'], # lte = "less than or equal" (menor ou igual)
            data_fim__gte=data['data_inicio']  # gte = "greater than or equal" (maior ou igual)
        ).exists() # .exists() retorna True se encontrar alguma

        if reservas_existentes:
            raise serializers.ValidationError("Estas datas já estão ocupadas ou pendentes. Por favor, escolha outras.")

        return data