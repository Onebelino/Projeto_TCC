from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
from django.db.models import Q

class EmailAuthBackend(BaseBackend):
    """
    Autenticar usando e-mail.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Tenta encontrar o usuário pelo username OU pelo email
            # O 'Q' permite fazer um 'OU'
            # 'username__iexact' ignora maiúsculas/minúsculas
            user = User.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username)
            )
            
            # Checa a senha
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            # Nenhum usuário encontrado
            return None
        except User.MultipleObjectsReturned:
            # Se (por algum motivo) tiver e-mails duplicados, 
            # tenta pegar apenas pelo e-mail
             user = User.objects.filter(email__iexact=username).order_by('id').first()
             if user and user.check_password(password):
                return user
             return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None