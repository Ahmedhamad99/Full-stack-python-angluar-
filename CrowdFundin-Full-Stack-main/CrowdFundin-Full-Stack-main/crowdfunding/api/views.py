from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions, filters
from rest_framework.authtoken.models import Token
from .models import Project, User
from .serializers import ProjectSerializer, UserSerializer
import requests
from django.utils import timezone
from django.http import JsonResponse

# Register View
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login View
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response({
                'token': token.key,
                'is_admin': user.is_admin,
                'user_id': user.id,
                'user': serializer.data
            })
#         if user:
#             token, _ = Token.objects.get_or_create(user=user)
#             serializer = UserSerializer(user)
#             return Response({
#                 'token': token.key,
#                 'is_admin': user.is_admin,
#                 'user_id': user.id,
#                 'user': serializer.data
#             })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# User Profile
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Require authentication

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Project List and Create View
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['start_time', 'end_time', 'title']

    def get_queryset(self):
        return Project.objects.all()

    # def get_queryset(self):
    #     if self.request.query_params.get('my_projects', 'false') == 'true':
    #         return Project.objects.filter(user=self.request.user)
    #     return Project.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Project Retrieve, Update, Destroy View
class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        project = self.get_object()
        if not (self.request.user.is_admin or project.user == self.request.user):
            raise permissions.PermissionDenied("Only admins or the project owner can update this project.")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_admin:
            raise permissions.PermissionDenied("Only admins can delete projects.")
        instance.delete()

# Populate Initial Data Function
def populate_initial_data():
    if Project.objects.count() == 0:
        response = requests.get('https://jsonplaceholder.typicode.com/posts')
        data = response.json()[:5]
        admin_user, _ = User.objects.get_or_create(username='admin', defaults={
            'is_admin': True,
            'email': 'admin@example.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'mobile_phone': '01000000000'
        })
        admin_user.set_password('admin123')
        admin_user.save()

        for item in data:
            Project.objects.create(
                user=admin_user,
                title=item['title'],
                details=item['body'],
                total_target=float(len(item['body'])),
                start_time=timezone.now(),
                end_time=timezone.now() + timezone.timedelta(days=30)
            )

# Home View
def home(request):
    return JsonResponse({"message": "Welcome to the Crowdfunding API!"})

# Verify Account View (No Email)
class VerifyAccountView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
            user.is_active = True  # Activate account directly
            user.save()
            return Response({"message": "Account verified successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Password Reset View (Simplified, No Email)
class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email not found"}, status=status.HTTP_404_NOT_FOUND)