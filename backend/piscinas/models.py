from django.db import models
from usuarios.models import Profile 

# O modelo Piscina foi "limpo"
class Piscina(models.Model):
    dono = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='piscinas')
    
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    cidade = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)
    preco_diaria = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    
    # --- O CAMPO 'imagem' FOI REMOVIDO DAQUI ---

    def __str__(self):
        return f'{self.titulo} - {self.cidade}'

# --- ✅ NOVO MODELO ADICIONADO ---
# Esta é a nova "tabela" que vai guardar as fotos
class PiscinaImagem(models.Model):
    # A "ligação" (Chave Estrangeira) com a Piscina
    # related_name='imagens' permite que a gente acesse (piscina.imagens.all())
    piscina = models.ForeignKey(Piscina, on_delete=models.CASCADE, related_name='imagens')
    
    # O campo da imagem
    imagem = models.ImageField(upload_to='piscinas_fotos/', blank=True, null=True)

    def __str__(self):
        # Mostra o ID da piscina e o ID da imagem
        return f"Imagem {self.id} da Piscina {self.piscina.id} ({self.piscina.titulo})"