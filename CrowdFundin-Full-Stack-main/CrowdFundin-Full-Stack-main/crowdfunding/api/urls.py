from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('verify-account/', views.VerifyAccountView.as_view(), name='verify-account'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('projects/', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', views.ProjectRetrieveUpdateDestroyView.as_view(), name='project-detail'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
]