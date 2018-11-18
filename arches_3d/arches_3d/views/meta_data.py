from arches.app.views.base import BaseManagerView
from arches.app.utils.response import JSONResponse
from arches.app.models.resource import Resource
from arches.app.utils.exceptions import InvalidNodeNameException, MultipleNodesFoundException


def get_node_values(request):
    resourceid = request.GET.get('resourceid')
    node_name = request.GET.get('node_name')

    resource = Resource.objects.get(pk=resourceid)
    value = ''

    try:
        value = resource.get_node_values(node_name)
    except InvalidNodeNameException:
        pass
    except MultipleNodesFoundException:
        pass
    return JSONResponse(value)
