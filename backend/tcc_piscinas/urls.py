"""
URL configuration for tcc_piscinas project.
"""
from django.contrib import admin
from django.urls import path, include

# --- 1. IMPORTE AS CONFIGURAÇÕES E A FUNÇÃO 'STATIC' ---
# Estas linhas são essenciais para as imagens funcionarem
from django.conf import settings
from django.conf.urls.static import static
# --------------------------------------------------

# Imports do JWT
from rest_framework_simplejwt.views import TokenRefreshView
# Importe a sua view customizada do token (que criamos para o erro anterior)
from usuarios.views import MyTokenObtainPairView 


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Nossas URLs de API
    path('api/', include('usuarios.urls')), 
    path('api/', include('piscinas.urls')), 
    path('api/', include('reservas.urls')),
    
    # URLs de Login (JWT)
    # Use a sua view customizada que inclui o 'profile_tipo'
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# --- 2. ADICIONE ESTAS LINHAS NO FINAL DO ARQUIVO ---
# Este é o bloco que "liga" o servidor de imagens no modo de desenvolvimento
# É o que vai consertar o "quadrinho quebrado"
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)