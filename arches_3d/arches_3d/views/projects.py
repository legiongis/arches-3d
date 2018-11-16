from django.views.generic import View
from django.shortcuts import render
from arches.app.views.base import BaseManagerView
from arches.app.models.resource import Resource
from arches.app.models.card import Card
from arches.app.models.graph import Graph
from arches.app.models.tile import Tile
from arches.app.utils.betterJSONSerializer import JSONSerializer

class ProjectsView(BaseManagerView):

    def get(self, request):
        projects = Resource.objects.filter(graph_id='243f8689-b8f6-11e6-84a5-026d961c88e6')
        perm = 'read_nodegroup'


        for project in projects:

            graph = Graph.objects.get(graphid='243f8689-b8f6-11e6-84a5-026d961c88e6')
            cards = Card.objects.filter(graph=graph).order_by('sortorder')
            tiles = Tile.objects.filter(resourceinstance=project).order_by('sortorder')
            project.permitted_cards = []
            project.permitted_tiles = []


            for card in cards:
                if request.user.has_perm(perm, card.nodegroup):
                    card.filter_by_perm(request.user, perm)
                    project.permitted_cards.append(card)
                    print 'Appended card: ' + card.name

            for tile in tiles:
                print 'nodegroup id: ' + str(tile.nodegroup_id)
                if str(tile.nodegroup_id) == 'fb0c163e-d138-11e8-814d-0242ac1a0004':
                    project.thumbnail_url = tile.data['fb0c1e72-d138-11e8-814d-0242ac1a0004'][0]['url']

                if request.user.has_perm(perm, tile.nodegroup):
                    tile.filter_by_perm(request.user, perm)
                    project.permitted_tiles.append(tile)
                    print 'Appended tile: ' 
                    print tile.tileid
                    print tile.nodegroup_id
                    print tile.data

        # context = self.get_context_data(
        #     main_script='views/projects',
        #     projects=JSONSerializer().serialize(projects, sort_keys=False),
        # )
        
        # context = super(ProjectsView, self).get_context_data()
        # context = {}
        # context['projects']['project1'] = { 'title': 'Test Project 1', 'image_url' : 'https://prodarchesstorage.blob.core.windows.net/arches/uploadedfiles/london_thumbnail_9ha1f5q.jpg' }



        return render(request, 'views/projects.htm', { 'projects': projects })