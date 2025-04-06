from django.contrib import admin
from .models import Project, User

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'total_target', 'start_time', 'end_time', 'user') 
    list_filter = ('start_time', 'end_time', 'user') 
    search_fields = ('title', 'details')  
    ordering = ('-start_time',) 

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_admin', 'is_active') 
    list_filter = ('is_admin', 'is_active')  
    search_fields = ('username', 'email')  
    ordering = ('username',)  