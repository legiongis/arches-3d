from django.conf import settings
from arches.app.utils import context_processors


def app_settings(request):
    app_settings = context_processors.app_settings(request)
    app_settings['app_settings'].update({
        'STATIC_URL_LOCAL': settings.STATIC_URL_LOCAL,
        'IMAGE_VERSION': settings.IMAGE_VERSION
    })
    return app_settings
