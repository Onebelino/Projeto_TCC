# usuarios/urls.py

from django.urls import path
from .views import RegisterView

urlpatterns = [
    # Esta será a URL: /api/register/
    path('register/', RegisterView.as_view(), name='register'),
]