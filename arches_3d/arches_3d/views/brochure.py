import urllib2
from urlparse import urlparse
from django.shortcuts import render
from arches.app.models.system_settings import settings
from django.http import HttpResponseNotFound, HttpResponse

def rockart(request) :
	return render(request, 'rockart.htm', {
        'main_script': 'index',
        'app_title': settings.APP_TITLE,
        'copyright_year': settings.COPYRIGHT_YEAR
    })
