"""backendapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "NUMED-AI ADMIN"

urlpatterns = [
    path('admin-numed/', admin.site.urls),

    # django ckeditor
    path('ckeditor', include('ckeditor_uploader.urls')),
    
    # API
    path('api-numed/', include('api.urls')),
    path('api-numed/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    # auth token
    path('auth-numed/', include('djoser.urls')),
    path('auth-numed/', include('djoser.urls.authtoken')),

]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
