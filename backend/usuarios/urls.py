# TCC/backend/usuarios/urls.py

from django.urls import path
# Importe a PasswordResetView
from .views import RegisterView, ProfileDetailView, UserDeleteView, PasswordResetView # <-- ✅ Adicionado

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profile/delete/', UserDeleteView.as_view(), name='profile-delete'),
    
    # --- ✅ NOVA ROTA ---
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
]