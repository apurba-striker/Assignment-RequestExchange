from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ReturnRequest, ReturnMedia
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        return token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class ReturnMediaSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ReturnMedia
        fields = ['id', 'file', 'file_url', 'media_type', 'uploaded_at']
        read_only_fields = ['uploaded_at']
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class ReturnRequestSerializer(serializers.ModelSerializer):
    media_files = ReturnMediaSerializer(many=True, read_only=True)
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = ReturnRequest
        fields = ['id', 'user', 'user_details', 'barcode', 'status', 'created_at', 'updated_at', 'admin_notes', 'media_files']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}".strip()
        }

class ReturnRequestCreateSerializer(serializers.ModelSerializer):
    media_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = ReturnRequest
        fields = ['barcode', 'media_files']
    
    def create(self, validated_data):
        media_files = validated_data.pop('media_files', [])
        return_request = ReturnRequest.objects.create(**validated_data)
        
        for file in media_files:
            file_extension = file.name.split('.')[-1].lower()
            media_type = 'video' if file_extension in ['mp4', 'avi', 'mov', 'mkv', 'webm'] else 'image'
            
            ReturnMedia.objects.create(
                return_request=return_request,
                file=file,
                media_type=media_type
            )
        
        return return_request
