from django.urls import path
from .views import RegisterAPI,LoginAPI,UserAPI,AccountsListCreateAPI,UserListCreateView,UserRetrieveUpdateDestroyView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
urlpatterns = [
    path('', AccountsListCreateAPI.as_view(), name='accounts-list-create'),  # عرض جميع المشاريع + إضافة مشروع جديد

    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('user/', UserAPI.as_view(), name='user'),
    path('accounts/', UserListCreateView.as_view(), name='user-list'),
    path('<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail')
]+ router.urls

# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/auth/', include('accounts.urls')),  # تأكد من تضمين مسارات الحسابات
# ]
