from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateSerializer

class ProjectListCreateAPI(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    permission_classes = [permissions.AllowAny]  
    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProjectCreateSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class ProjectRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]  
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(creator=self.request.user)  
        else:
           serializer.save()  

    def perform_destroy(self, instance):
        instance = self.get_object()
        instance.delete()  
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_update(self, serializer):
        project = self.get_object()
        if not (self.request.user.is_admin or project.user == self.request.user):
            raise permissions.PermissionDenied("Only admins or the project owner can update this project.")
        serializer.save()
class ProjectSearchAPI(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        search_date = self.request.query_params.get('date', None)
        search_title = self.request.query_params.get('title', None)

        if search_date:
            queryset = queryset.filter(start_time__date=search_date)

        if search_title:
            queryset = queryset.filter(title__icontains=search_title)

        return queryset
