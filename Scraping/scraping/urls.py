"""
URL configuration for scraping project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path
from .views import dump_chunked_view
from .views import scrape_and_store 
from .views import update_lecture_category_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dump-chunked/', dump_chunked_view, name='dump_chunked'),
    path('scrape/', scrape_and_store, name='scrape_and_store'),
    path('update-lecture-category/', update_lecture_category_view, name='update_lecture_category'),
]
