from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from arches_3d.views import brochure


from arches_3d.views import projects, heritage_sites, meta_data

urlpatterns = [
    url(r'^', include('arches.urls')),
    url(r'^node_values$', meta_data.get_node_values, name="node_values"),
    url(r'^rockart', brochure.rockart, name='rockart.htm')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
    # import debug_toolbar
    # urlpatterns = [ 
        # url(r'^__debug__/', include(debug_toolbar.urls)),
    # ] + urlpatterns
