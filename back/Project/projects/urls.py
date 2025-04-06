from django.urls import path
from .views import (
    ProjectListCreateAPI,
    ProjectRetrieveUpdateDestroyAPI,
    ProjectSearchAPI
)

app_name = "projects"

urlpatterns = [
    path('', ProjectListCreateAPI.as_view(), name='project-list-create'),  
    path('<int:pk>/', ProjectRetrieveUpdateDestroyAPI.as_view(), name='project-detail'),
    path('search/projects/', ProjectSearchAPI.as_view(), name='project-search'),  
]
