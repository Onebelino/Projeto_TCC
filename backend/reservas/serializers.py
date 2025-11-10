from rest_framework import serializers
from .models import Reserva
import datetime

# --- ESTA É A SUA CLASSE ANTIGA (DEIXE ELA AQUI) ---
class ReservaSerializer(serializers.ModelSerializer):
    
    locatario_username = serializers.CharField(source='locatario.user.username', read_only=True)
    
    # --- ✅ MUDANÇA AQUI: Adicionamos o nome da piscina ---
    # Isto é para o painel do locador saber o nome da piscina
    piscina_titulo = serializers.CharField(source='piscina.titulo', read_only=True)

    class Meta:
        model = Reserva
        fields = [
            'id', 
            'piscina', 
            'piscina_titulo', # <-- ✅ Novo campo na resposta
            'locatario', 
            'locatario_username', 
            'data_inicio', 
            'data_fim', 
            'preco_total', 
            'status', 
            'criado_em'
        ]
        # O locatário SÓ envia 'piscina', 'data_inicio', 'data_fim', 'preco_total'
        read_only_fields = ['locatario', 'status', 'locatario_username', 'piscina_titulo']

    def validate(self, data):
        # 1. A data final não pode ser antes da inicial
        if data['data_inicio'] > data['data_fim']:
            raise serializers.ValidationError("A data final deve ser depois da data inicial.")
        
        # 2. A data inicial não pode ser no passado
        if data['data_inicio'] < datetime.date.today():
             raise serializers.ValidationError("Não é possível agendar datas no passado.")

        # 3. Lógica anti-colisão
        reservas_existentes = Reserva.objects.filter(
            piscina=data['piscina'],
            status__in=[Reserva.StatusReserva.PENDENTE, Reserva.StatusReserva.CONFIRMADA],
            data_inicio__lte=data['data_fim'],
            data_fim__gte=data['data_inicio']
        ).exists() 

        if reservas_existentes:
            raise serializers.ValidationError("Estas datas já estão ocupadas ou pendentes. Por favor, escolha outras.")

        return data
# ----------------------------------------------------


# --- ESTA É A SUA CLASSE PARA O 'PATCH' (DEIXE ELA AQUI) ---
class ReservaStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Um serializer simples que permite *apenas* a atualização do campo 'status'.
    Usado pelo Locador para Aceitar/Recusar.
    """
    class Meta:
        model = Reserva
        fields = ['status'] # O único campo que o Locador pode mudar
# ----------------------------------------------------