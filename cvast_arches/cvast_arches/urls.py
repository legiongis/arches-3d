from django.conf.urls import include, url
from django.contrib import admin
from cvast_arches import settings

urlpatterns = [
    url(r'^', include('arches.urls')),
    url(r'^admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)