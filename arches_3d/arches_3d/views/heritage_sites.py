from django.views.generic import View
from django.shortcuts import render
from arches.app.views.base import BaseManagerView
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
                    site.thumbnail_url = tile.data['a13a9cc4-d134-11e8-a039-0242ac1a0004'][0]['url'] or ''
                elif str(tile.nodegroup_id) == '065b7267-e746-11e6-84a6-026d961c88e6': 
                    if tile.data['065b726b-e746-11e6-84a6-026d961c88e6'] == 'eb3bd719-c473-40b8-bf0a-cdb9ed89aba3':
                        site.primary_description = tile.data['065b726a-e746-11e6-84a6-026d961c88e6'] or ''

        return render(request, 'views/heritage-sites.htm', { 'sites': sites })
