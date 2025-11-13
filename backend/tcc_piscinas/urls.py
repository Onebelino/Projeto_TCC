"""
URL configuration for tcc_piscinas project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# --- 1. IMPORTAMOS AS VIEWS CORRETAS ---
from rest_framework_simplejwt.views import TokenRefreshView
# Removemos o 'TokenObtainPairView' padrão
# E importamos a NOSSA view customizada de 'usuarios.views'
from usuarios.views import MyTokenObtainPairView 
# ---------------------------------------------

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Nossas URLs de API
    path('api/', include('usuarios.urls')), 
    path('api/', include('piscinas.urls')), 
    path('api/', include('reservas.urls')), 
    path('api/', include('avaliacoes.urls')),

    # --- 2. APONTAMOS PARA A VIEW CORRETA ---
    # A URL de 'token' (login) agora usa a NOSSA view
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # ---------------------------------------------
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Configuração de Mídia (sem mudança)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)