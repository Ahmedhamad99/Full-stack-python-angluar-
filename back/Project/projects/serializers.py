from rest_framework import serializers
from .models import Project
from accounts.serializers import UserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)  
    
    class Meta:
        model = Project
        fields = '__all__'


class ProjectCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)  
    start_time = serializers.DateTimeField(required=True)
    end_time = serializers.DateTimeField(required=True)

    class Meta:
        model = Project
        fields = ('title', 'details', 'total_target', 'start_time', 'end_time', 'image')

    def validate(self, data):
       
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time")
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        
        user = request.user if request and request.user.is_authenticated else None
        validated_data['creator'] = user  

        return super().create(validated_data)
