from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static

from arches_3d.views import projects, heritage_sites, main, meta_data, resource


uuid_regex = settings.UUID_REGEX

urlpatterns = [
    url(r'^projects$', projects.ProjectsView.as_view(), name="projects"),
    url(r'^sites$', heritage_sites.HeritageSitesView.as_view(), name="sites"),
    url(r'^node_values$', meta_data.get_node_values, name="node_values"),
    url(r'^report/(?P<resourceid>%s)$' % uuid_regex, resource.Arches3DResourceReportView.as_view(), name='resource_report'),
    # url(r'^report-templates/(?P<template>[a-zA-Z_-]*)', main.report_templates, name="report-templates"),
    url(r'^', include('arches.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
