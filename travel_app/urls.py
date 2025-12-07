from django.urls import path
from . import views

urlpatterns = [
    path("api/recommend/", views.recommend_view, name="recommend_view"),
]
