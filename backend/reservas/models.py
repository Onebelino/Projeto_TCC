from django.db import models
from piscinas.models import Piscina
from usuarios.models import Profile

# Este é o "molde" para uma reserva no seu banco de dados
class Reserva(models.Model):
    
    # Definimos os status possíveis para uma reserva
    class StatusReserva(models.TextChoices):
        PENDENTE = 'PENDENTE', 'Pendente'       # O locatário solicitou, aguardando locador
        CONFIRMADA = 'CONFIRMADA', 'Confirmada' # O locador aceitou
        CANCELADA = 'CANCELADA', 'Cancelada'     # O locador ou locatário cancelou
        CONCLUIDA = 'CONCLUIDA', 'Concluída'     # A data já passou

    # A qual piscina esta reserva pertence?
    # Se a piscina for deletada, todas as suas reservas são deletadas.
    piscina = models.ForeignKey(Piscina, on_delete=models.CASCADE, related_name='reservas')
    
    # Quem está alugando? (O Locatário)
    # Ligamos ao Perfil, pois é lá que temos os dados do usuário
    locatario = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='minhas_reservas')

    # As datas da reserva
    data_inicio = models.DateField()
    data_fim = models.DateField()
    
    # O preço total (calculado no momento da solicitação)
    preco_total = models.DecimalField(max_digits=10, decimal_places=2)

    # O status atual da reserva
    status = models.CharField(
        max_length=20,
        choices=StatusReserva.choices,
        default=StatusReserva.PENDENTE  # Toda nova reserva começa como "Pendente"
    )
    
    # Data em que a solicitação foi criada
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Texto que vai aparecer no painel de admin do Django
        return f"Reserva de {self.piscina.titulo} por {self.locatario.user.username} ({self.get_status_display()})"