from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from .models import ReturnRequest, ReturnMedia
from .serializers import (
    UserSerializer, 
    ReturnRequestSerializer, 
    ReturnRequestCreateSerializer,
    ReturnMediaSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class ReturnRequestViewSet(viewsets.ModelViewSet):
    queryset = ReturnRequest.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReturnRequestCreateSerializer
        return ReturnRequestSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # Admin can see all requests
            queryset = ReturnRequest.objects.all().prefetch_related('media_files')
            
            # Search functionality for admin
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(barcode__icontains=search) |
                    Q(user__username__icontains=search) |
                    Q(user__email__icontains=search)
                )
            
            return queryset
        else:
            return ReturnRequest.objects.filter(user=user).prefetch_related('media_files')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        return_request = self.get_object()
        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')
        
        if new_status not in ['pending', 'approved', 'rejected']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return_request.status = new_status
        return_request.admin_notes = admin_notes
        return_request.save()
        
        serializer = self.get_serializer(return_request)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def statistics(self, request):
        total_requests = ReturnRequest.objects.count()
        pending = ReturnRequest.objects.filter(status='pending').count()
        approved = ReturnRequest.objects.filter(status='approved').count()
        rejected = ReturnRequest.objects.filter(status='rejected').count()
        
        return Response({
            'total_requests': total_requests,
            'pending': pending,
            'approved': approved,
            'rejected': rejected,
        })
