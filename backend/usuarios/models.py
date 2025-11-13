# TCC/backend/usuarios/models.py

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    
    class TipoUsuario(models.TextChoices):
        LOCADOR = 'LOCADOR', 'Locador'
        LOCATARIO = 'LOCATARIO', 'Locatário'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    tipo = models.CharField(
        max_length=10,
        choices=TipoUsuario.choices,
        default=TipoUsuario.LOCATARIO
    )
    
    telefone = models.CharField(max_length=20, blank=True, null=True)
    
    # --- ✅ AQUI ESTÁ A SEGURANÇA ---
    # unique=True impede duplicatas no nível do Banco de Dados
    cpf = models.CharField(max_length=14, blank=True, null=True, unique=True)
    # -------------------------------

    nome_completo = models.CharField(max_length=255, blank=True, null=True)
    data_nascimento = models.DateField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} ({self.tipo})'