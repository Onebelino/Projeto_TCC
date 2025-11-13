from django.db import models
from usuarios.models import Profile
from piscinas.models import Piscina
from django.core.validators import MinValueValidator, MaxValueValidator

class Avaliacao(models.Model):
    autor = models.ForeignKey(Profile, on_delete=models.CASCADE)
    piscina = models.ForeignKey(Piscina, on_delete=models.CASCADE, related_name='avaliacoes')
    nota = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comentario = models.TextField()
    
    # --- ✅ NOVO CAMPO ---
    resposta = models.TextField(blank=True, null=True) # A resposta do dono
    # ---------------------
    
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('autor', 'piscina')

    def __str__(self):
        return f"{self.nota} estrelas para {self.piscina.titulo}"