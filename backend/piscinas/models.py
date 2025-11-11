# TCC/backend/piscinas/models.py

from django.db import models
from usuarios.models import Profile 

ESTADOS_BRASILEIROS = (
    ('AC', 'Acre'), ('AL', 'Alagoas'), ('AP', 'Amapá'), ('AM', 'Amazonas'),
    ('BA', 'Bahia'), ('CE', 'Ceará'), ('DF', 'Distrito Federal'), ('ES', 'Espírito Santo'),
    ('GO', 'Goiás'), ('MA', 'Maranhão'), ('MT', 'Mato Grosso'), ('MS', 'Mato Grosso do Sul'),
    ('MG', 'Minas Gerais'), ('PA', 'Pará'), ('PB', 'Paraíba'), ('PR', 'Paraná'),
    ('PE', 'Pernambuco'), ('PI', 'Piauí'), ('RJ', 'Rio de Janeiro'), ('RN', 'Rio Grande do Norte'),
    ('RS', 'Rio Grande do Sul'), ('RO', 'Rondônia'), ('RR', 'Roraima'), ('SC', 'Santa Catarina'),
    ('SP', 'São Paulo'), ('SE', 'Sergipe'), ('TO', 'Tocantins'),
)

class Piscina(models.Model):
    dono = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='piscinas')
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2, choices=ESTADOS_BRASILEIROS, blank=True, null=True)
    endereco = models.CharField(max_length=255)
    preco_diaria = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    # (O campo 'imagem' (singular) não existe mais aqui)

    def __str__(self):
        return f'{self.titulo} - {self.cidade}/{self.estado}'

class PiscinaImagem(models.Model):
    piscina = models.ForeignKey(Piscina, on_delete=models.CASCADE, related_name='imagens')
    imagem = models.ImageField(upload_to='piscinas_fotos/', blank=True, null=True)

    def __str__(self):
        return f"Imagem {self.id} da Piscina {self.piscina.id} ({self.piscina.titulo})"