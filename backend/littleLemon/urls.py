"""
URL configuration for littleLemon project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from littleLemonAPI.auth_views import (
    CookieLogoutView,
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    csrf_token,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("littleLemonAPI.urls")),
    path("api/auth/", include("djoser.urls")),
    path("api/auth/jwt/create/", CookieTokenObtainPairView.as_view()),
    path("api/auth/jwt/refresh/", CookieTokenRefreshView.as_view()),
    path("api/auth/jwt/logout/", CookieLogoutView.as_view()),
    path("api/auth/csrf/", csrf_token),
]
