from django.contrib import admin
from .models import ReturnRequest, ReturnMedia

@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'barcode', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['barcode', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(ReturnMedia)
class ReturnMediaAdmin(admin.ModelAdmin):
    list_display = ['id', 'return_request', 'media_type', 'uploaded_at']
    list_filter = ['media_type', 'uploaded_at']
