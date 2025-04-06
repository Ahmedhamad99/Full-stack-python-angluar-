from rest_framework import serializers
from .models import Project, User

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=False)  # Make optional

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'confirm_password', 'mobile_phone', 'is_admin']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'confirm_password': {'write_only': True, 'required': False},
            'username': {'read_only': True},  # Prevent username changes if desired
        }

    def validate(self, data):
        
        if 'password' in data and 'confirm_password' in data:
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError("Passwords do not match")
        return data
    def validate_mobile_phone(self, value):
        if value and not re.match(r'^01[0125][0-9]{8}$', value):
            raise serializers.ValidationError("Invalid Egyptian mobile phone number")
        return value
    def create(self, validated_data):
        validated_data.pop('confirm_password', None)  
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        validated_data.pop('confirm_password', None)
        for attr, value in validated_data.items():
            if attr == 'password' and value:
                instance.set_password(value)
            elif value is not None:
                setattr(instance, attr, value)
        instance.save()
        return instance

class ProjectSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'details', 'total_target', 'start_time', 'end_time', 'user','image'] # Add 'image' here
# class UserSerializer(serializers.ModelSerializer):
#     confirm_password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'confirm_password', 'mobile_phone', 'is_admin']
#         extra_kwargs = {'password': {'write_only': True}, 'confirm_password': {'write_only': True}}

#     def validate(self, data):
#         if data['password'] != data['confirm_password']:
#             raise serializers.ValidationError("Passwords do not match")
#         return data

#     def create(self, validated_data):
#         validated_data.pop('confirm_password')
#         user = User.objects.create_user(**validated_data)
#         return user
