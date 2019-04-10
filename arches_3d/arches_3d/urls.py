from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from arches_3d.views import brochure


from arches_3d.views import projects, heritage_sites, meta_data

urlpatterns = [
    url(r'^', include('arches.urls')),
    url(r'^projects$', projects.ProjectsView.as_view(), name="projects"),
    url(r'^sites$', heritage_sites.HeritageSitesView.as_view(), name="sites"),
    url(r'^node_values$', meta_data.get_node_values, name="node_values"),
    url(r'^team/', brochure.team, name='team'),
    url(r'^equipment/', brochure.equipment, name='equipment'),
    url(r'^news/', brochure.news, name='news'),
    url(r'^publications/', brochure.publications, name='publications'),
    url(r'^labs/', brochure.labs, name='labs')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
    # import debug_toolbar
    # urlpatterns = [ 
        # url(r'^__debug__/', include(debug_toolbar.urls)),
    # ] + urlpatterns
