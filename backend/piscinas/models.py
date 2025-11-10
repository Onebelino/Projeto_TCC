# piscinas/models.py

from django.db import models
from usuarios.models import Profile # Vamos importar o Profile que já criamos

class Piscina(models.Model):
    # 'dono' é a ligação com o perfil do usuário
    # related_name='piscinas' permite que a gente acesse (profile.piscinas.all())
    dono = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='piscinas')
    
    # Campos da piscina
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    cidade = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)
    preco_diaria = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    imagem = models.ImageField(upload_to='piscinas_fotos/', blank=True, null=True)
    
    # (Vamos adicionar fotos depois, por enquanto só texto)

    def __str__(self):
        return f'{self.titulo} - {self.cidade}'