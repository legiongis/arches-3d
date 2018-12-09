from collections import defaultdict
from django.views.generic import View
from django.shortcuts import render
from arches.app.views.base import BaseManagerView
from arches.app.models import models
from arches.app.models.resource import Resource
from arches.app.models.card import Card
from arches.app.models.graph import Graph
from arches.app.models.tile import Tile
from arches.app.utils.betterJSONSerializer import JSONSerializer

class HeritageSitesView(BaseManagerView):

    def get(self, request):
        sites = Resource.objects.filter(graph_id='fad0563b-b8f8-11e6-84a5-026d961c88e6')

        for site in sites:
            tiles = Tile.objects.filter(resourceinstance=site).order_by('sortorder')
            for tile in tiles:
                if str(tile.nodegroup_id) == 'a13a9486-d134-11e8-a039-0242ac1a0004':
                    if len(tile.data['a13a9cc4-d134-11e8-a039-0242ac1a0004']) > 0:
                        site.thumbnail_url = tile.data['a13a9cc4-d134-11e8-a039-0242ac1a0004'][0]['url'] or ''

                elif str(tile.nodegroup_id) == '709e4cf8-b12e-11e8-81d7-0242ac140004':
                    site.country = models.Value.objects.get(pk=tile.data['709e5d74-b12e-11e8-81d7-0242ac140004']).value

            if hasattr(site, 'country'):
                site.css_safe_country = site.country.replace(' ','-')
            else: 
                site.css_safe_country = 'other'
                site.country = 'Other'
 

        return render(request, 'views/heritage-sites.htm', { 'sites': sites })
