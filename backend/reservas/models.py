from django.db import models
from piscinas.models import Piscina
from usuarios.models import Profile

# Este é o "molde" para uma reserva no seu banco de dados
class Reserva(models.Model):
    class StatusReserva(models.TextChoices):
        PENDENTE = 'PENDENTE', 'Pendente'       
        CONFIRMADA = 'CONFIRMADA', 'Confirmada' 
        CANCELADA = 'CANCELADA', 'Cancelada'    
        CONCLUIDA = 'CONCLUIDA', 'Concluída'  


    piscina = models.ForeignKey(Piscina, on_delete=models.CASCADE, related_name='reservas')
    
    locatario = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='minhas_reservas')

    data_inicio = models.DateField()
    data_fim = models.DateField()
    
    preco_total = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=StatusReserva.choices,
        default=StatusReserva.PENDENTE
    )
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reserva de {self.piscina.titulo} por {self.locatario.user.username} ({self.get_status_display()})"