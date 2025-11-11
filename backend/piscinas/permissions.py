from rest_framework import permissions

class IsDonodaPiscina(permissions.BasePermission):
    """
    Permissão customizada para permitir que apenas o dono da piscina
    possa editá-la ou excluí-la.
    """

    def has_object_permission(self, request, view, obj):
        # 'obj' aqui é a instância da 'Piscina' que o usuário está
        # tentando editar ou excluir.
        
        # A permissão é concedida se o perfil do usuário logado
        # (request.user.profile) for o dono da piscina (obj.dono).
        if request.user.is_authenticated:
            return obj.dono == request.user.profile
        return False