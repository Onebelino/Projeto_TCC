from django.urls import path
from .views import AvaliacaoListCreateView, AvaliacaoRespostaView

urlpatterns = [
    path('avaliacoes/', AvaliacaoListCreateView.as_view(), name='avaliacao-list-create'),
    # Nova rota: /api/avaliacoes/5/responder/
    path('avaliacoes/<int:pk>/responder/', AvaliacaoRespostaView.as_view(), name='avaliacao-responder'),
]