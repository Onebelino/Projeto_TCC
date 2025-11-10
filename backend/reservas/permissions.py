from rest_framework import permissions

class IsDonodaPiscinaDaReserva(permissions.BasePermission):
    """
    Permissão customizada para permitir que apenas o dono da piscina
    possa editar o status da reserva.
    """

    def has_object_permission(self, request, view, obj):
        # 'obj' aqui é a instância da 'Reserva'
        # A permissão é concedida se o perfil do usuário logado (request.user.profile)
        # for o mesmo que o dono da piscina (obj.piscina.dono)
        if request.user.is_authenticated:
            return obj.piscina.dono == request.user.profile
        return False