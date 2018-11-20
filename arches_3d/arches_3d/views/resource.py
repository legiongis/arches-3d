from django.http import Http404
from django.shortcuts import render

from arches.app.models import models
from arches.app.models.card import Card
from arches.app.models.graph import Graph
from arches.app.models.tile import Tile
from arches.app.models.resource import Resource
from arches.app.views.resource import ResourceReportView
from arches.app.utils.betterJSONSerializer import JSONSerializer

class Arches3DResourceReportView(ResourceReportView):

    def get(self, request, resourceid=None):
        print 'In report_templates view'
        viewer_only = request.GET.get('viewer_only', False)
        print viewer_only

        if viewer_only:
            extends = 'views/report-templates/empty-template.htm'
            return self.get_viewer_only(request, resourceid)

        extends = 'views/report-templates/default.htm'
        return super(Arches3DResourceReportView, self).get(request, resourceid)
    

    def get_viewer_only(self, request, resourceid=None):
        resource = Resource.objects.get(pk=resourceid)
        displayname = resource.displayname

        tiles = Tile.objects.filter(resourceinstance=resource).order_by('sortorder')

        graph = Graph.objects.get(graphid=resource.graph_id)
        cards = Card.objects.filter(graph=graph).order_by('sortorder')
        permitted_cards = []
        permitted_tiles = []

        perm = 'read_nodegroup'

        for card in cards:
            if request.user.has_perm(perm, card.nodegroup):
                card.filter_by_perm(request.user, perm)
                permitted_cards.append(card)

        for tile in tiles:
            if request.user.has_perm(perm, tile.nodegroup):
                tile.filter_by_perm(request.user, perm)
                permitted_tiles.append(tile)


        try:
            map_layers = models.MapLayer.objects.all()
            map_markers = models.MapMarker.objects.all()
            map_sources = models.MapSource.objects.all()
            geocoding_providers = models.Geocoder.objects.all()
        except AttributeError:
            raise Http404(_("No active report template is available for this resource."))

        cardwidgets = [widget for widgets in [card.cardxnodexwidget_set.order_by(
            'sortorder').all() for card in permitted_cards] for widget in widgets]

        datatypes = models.DDataType.objects.all()
        widgets = models.Widget.objects.all()
        templates = models.ReportTemplate.objects.all()
        card_components = models.CardComponent.objects.all()

        context = self.get_context_data(
            main_script='views/resource/report',
            report_templates=templates,
            templates_json=JSONSerializer().serialize(templates, sort_keys=False, exclude=['name', 'description']),
            card_components=card_components,
            card_components_json=JSONSerializer().serialize(card_components),
            cardwidgets=JSONSerializer().serialize(cardwidgets),
            tiles=JSONSerializer().serialize(permitted_tiles, sort_keys=False),
            cards=JSONSerializer().serialize(permitted_cards, sort_keys=False, exclude=[
                'is_editable', 'description', 'instructions', 'helpenabled', 'helptext', 'helptitle', 'ontologyproperty']),
            datatypes_json=JSONSerializer().serialize(
                datatypes, exclude=['modulename', 'issearchable', 'configcomponent', 'configname', 'iconclass']),
            geocoding_providers=geocoding_providers,
            related_resources='',
            widgets=widgets,
            map_layers=map_layers,
            map_markers=map_markers,
            map_sources=map_sources,
            graph_id=graph.graphid,
            graph_name=graph.name,
            graph_json=JSONSerializer().serialize(graph, sort_keys=False, exclude=[
                'functions', 'relatable_resource_model_ids', 'domain_connections', 'edges', 'is_editable', 'description', 'iconclass', 'subtitle', 'author']),
            resourceid=resourceid,
            displayname=displayname,
        )

        if graph.iconclass:
            context['nav']['icon'] = graph.iconclass
        context['nav']['title'] = graph.name
        context['nav']['res_edit'] = True
        context['nav']['print'] = True
        context['nav']['print'] = True

        return render(request, 'views/resource/report-viewer-only.htm', context)