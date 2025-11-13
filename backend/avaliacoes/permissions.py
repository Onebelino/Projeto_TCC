from rest_framework import permissions
from reservas.models import Reserva

# Permissão para criar avaliação (já existia)
class PodeAvaliarPiscina(permissions.BasePermission):
    message = "Você precisa ter uma reserva confirmada nesta piscina para avaliá-la."
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        piscina_id = request.data.get('piscina')
        if not piscina_id:
            return False
        tem_reserva = Reserva.objects.filter(
            locatario=request.user.profile,
            piscina_id=piscina_id,
            status=Reserva.StatusReserva.CONFIRMADA
        ).exists()
        return tem_reserva

# --- ✅ NOVA PERMISSÃO ---
class IsDonoDaPiscinaDaAvaliacao(permissions.BasePermission):
    """
    Permite que apenas o DONO da piscina responda à avaliação.
    """
    def has_object_permission(self, request, view, obj):
        # obj é a Avaliacao. obj.piscina.dono é o dono.
        if request.user.is_authenticated:
            return obj.piscina.dono == request.user.profile
        return False