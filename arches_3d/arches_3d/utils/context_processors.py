from django.conf import settings

def global_settings(request):
    return { 'STATIC_URL_LOCAL': settings.STATIC_URL_LOCAL }
