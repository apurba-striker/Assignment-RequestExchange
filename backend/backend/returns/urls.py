from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReturnRequestViewSet, register, user_profile

router = DefaultRouter()
router.register(r'return-requests', ReturnRequestViewSet, basename='return-request')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('profile/', user_profile, name='profile'),
]
