from rest_framework import permissions

# --- DEIXE ESTA CLASSE AQUI (DO PASSO ANTERIOR) ---
class IsDonodaPiscinaDaReserva(permissions.BasePermission):
    """
    Permissão customizada para permitir que apenas o dono da piscina
    possa editar o status da reserva.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return obj.piscina.dono == request.user.profile
        return False

# --- ✅ ADICIONE ESTA NOVA CLASSE NO FINAL ---
class IsLocatarioDaReserva(permissions.BasePermission):
    """
    Permissão customizada para permitir que apenas o locatário
    (dono da reserva) possa editá-la (ex: cancelá-la).
    """
    def has_object_permission(self, request, view, obj):
        # 'obj' aqui é a instância da 'Reserva'
        # A permissão é concedida se o perfil do usuário logado
        # for o mesmo que o 'locatario' da reserva.
        if request.user.is_authenticated:
            return obj.locatario == request.user.profile
        return False