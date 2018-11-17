from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static

from arches_3d.views import projects, heritage_sites

urlpatterns = [
    url(r'^', include('arches.urls')),
    url(r'^projects$', projects.ProjectsView.as_view(), name="projects"),
    url(r'^sites$', heritage_sites.HeritageSitesView.as_view(), name="sites"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
