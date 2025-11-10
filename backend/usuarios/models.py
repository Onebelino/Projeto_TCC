# usuarios/models.py

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    
    class TipoUsuario(models.TextChoices):
        LOCATARIO = 'LOCATARIO', 'Locatário'
        LOCADOR = 'LOCADOR', 'Locador'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    tipo = models.CharField(
        max_length=10,
        choices=TipoUsuario.choices,
        default=TipoUsuario.LOCATARIO
    )

    # --- NOSSAS NOVAS LINHAS ---
    
    # max_length=20 para aguentar (xx) xxxxx-xxxx
    telefone = models.CharField(max_length=20, null=True, blank=True)
    
    # max_length=14 para aguentar xxx.xxx.xxx-xx
    # unique=True garante que não teremos dois cadastros com o mesmo CPF
    cpf = models.CharField(max_length=14, null=True, blank=True, unique=True)
    
    # ---------------------------

    def __str__(self):
        return f'{self.user.username} - {self.get_tipo_display()}'