from django.urls import path
# --- ✅ 1. IMPORTS ATUALIZADOS ---
from .views import RegisterView, ProfileDetailView, UserDeleteView

urlpatterns = [
    # Rota de Registro (existente)
    # /api/register/
    path('register/', RegisterView.as_view(), name='register'),
    
    # --- ✅ 2. NOVAS ROTAS ---
    
    # /api/profile/ (Para o usuário ver (GET) e editar (PATCH) seu perfil)
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),
    
    # /api/profile/delete/ (Para o usuário excluir (DELETE) sua conta)
    path('profile/delete/', UserDeleteView.as_view(), name='profile-delete'),
]