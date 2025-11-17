from django.urls import path
from . import views

urlpatterns = [
    path("recomendar/", views.recommend_view, name="recommend_view"),
]

