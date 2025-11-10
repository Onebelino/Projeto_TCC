from rest_framework import serializers
from .models import Reserva
import datetime

# --- CLASSE 1 (EXISTENTE) ---
class ReservaSerializer(serializers.ModelSerializer):
    locatario_username = serializers.CharField(source='locatario.user.username', read_only=True)
    piscina_titulo = serializers.CharField(source='piscina.titulo', read_only=True)

    class Meta:
        model = Reserva
        fields = [
            'id', 
            'piscina', 
            'piscina_titulo',
            'locatario', 
            'locatario_username', 
            'data_inicio', 
            'data_fim', 
            'preco_total', 
            'status', 
            'criado_em'
        ]
        read_only_fields = ['locatario', 'status', 'locatario_username', 'piscina_titulo']

    def validate(self, data):
        # ... (Toda a sua lógica de validação de datas fica aqui, sem mudança)
        if data['data_inicio'] > data['data_fim']:
            raise serializers.ValidationError("A data final deve ser depois da data inicial.")
        if data['data_inicio'] < datetime.date.today():
             raise serializers.ValidationError("Não é possível agendar datas no passado.")
        reservas_existentes = Reserva.objects.filter(
            piscina=data['piscina'],
            status__in=[Reserva.StatusReserva.PENDENTE, Reserva.StatusReserva.CONFIRMADA],
            data_inicio__lte=data['data_fim'],
            data_fim__gte=data['data_inicio']
        ).exists() 
        if reservas_existentes:
            raise serializers.ValidationError("Estas datas já estão ocupadas ou pendentes. Por favor, escolha outras.")
        return data

# --- CLASSE 2 (EXISTENTE) ---
class ReservaStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para o Locador Aceitar/Recusar.
    """
    class Meta:
        model = Reserva
        fields = ['status'] 

# --- ✅ ADICIONE ESTA NOVA CLASSE NO FINAL ---
class ReservaCancelSerializer(serializers.ModelSerializer):
    """
    Serializer para o Locatário *apenas* cancelar.
    """
    class Meta:
        model = Reserva
        fields = ['status']
    
    def validate_status(self, value):
        # Validação extra: O locatário SÓ pode mudar o status para 'CANCELADA'
        if value != Reserva.StatusReserva.CANCELADA:
            raise serializers.ValidationError("Você só pode atualizar o status para 'CANCELADA'.")
        return value