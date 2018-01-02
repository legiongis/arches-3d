import os
import sys
import django

os.environ['DJANGO_SETTINGS_MODULE'] = "arches.settings"
django.setup()

ontologies = {}

def get_classes_and_properties(ontolgy_id):
    from arches.app.models import models
    from rdflib import Graph, RDF, RDFS
    if ontolgy_id not in ontologies:
        ontology_classes = {}
        ontology_properties = {}
        for ontology in models.Ontology.objects.filter(pk=ontolgy_id):
            g = Graph()
            g.parse(ontology.path.path)
            for extension in models.Ontology.objects.filter(parentontology=ontology):
                g.parse(extension.path.path)

            for ontology_property,p,o in g.triples((None, None, RDF.Property)):
                ontology_properties[str(ontology_property).split('/')[-1]] = str(ontology_property)
                for s,p,domain_class in g.triples((ontology_property, RDFS.domain, None)):
                    ontology_classes[str(domain_class).split('/')[-1]] = str(domain_class)
                for s,p,range_class in g.triples((ontology_property, RDFS.range, None)):
                    ontology_classes[str(range_class).split('/')[-1]] = str(range_class) 

            for ontology_class,p,o in g.triples((None, None, RDFS.Class)):
                ontology_classes[str(ontology_class).split('/')[-1]] = str(ontology_class)

        ontologies[ontolgy_id] = {'ontology_classes': ontology_classes, 'ontology_properties': ontology_properties}

    return ontologies[ontolgy_id]

def migrate_graphs(dir, overwrite=False):
    from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer

    for filename in os.listdir(dir):
        if filename.endswith(".json"):
            file_path = os.path.join(dir, filename)
            print file_path
            with open(file_path, 'r') as f:
                graph_json = JSONDeserializer().deserialize(f.read())
                if 'graph' not in graph_json:
                    continue
                ontology_id = graph_json['graph'][0]['ontology_id']
                nodes = graph_json['graph'][0]['nodes']
                edges = graph_json['graph'][0]['edges']
                name_mapping = get_classes_and_properties(ontology_id)
                
                for node in nodes:
                    try:
                        node['ontologyclass'] = name_mapping['ontology_classes'][node['ontologyclass']]
                    except:
                        if node['ontologyclass'] != '':
                            print "couldn't find a mapping for ontologyclass: %s" % node['ontologyclass']

                    try:
                        node['parentproperty'] = name_mapping['ontology_properties'][node['parentproperty']]
                    except:
                        if node['parentproperty'] != '':
                            print "couldn't find a mapping for parentproperty: %s" % node['parentproperty']

                    if node['istopnode']:
                        graph_json['graph'][0]['root'] = node

                for edge in edges:
                    try:
                        edge['ontologyproperty'] = name_mapping['ontology_properties'][edge['ontologyproperty']]
                    except:
                        if edge['ontologyproperty'] != '':
                            print "couldn't find a mapping for ontologyproperty: %s" % edge['ontologyproperty']
            
            if not overwrite:
                file_path = file_path + ".new"
            with open(os.path.abspath(file_path), 'wb') as f:
                f.write(JSONSerializer().serialize(graph_json, indent=4))


def main(argv=None):
    try:
        if argv[2].lower() in ('yes', 'true', 't', 'y', '1'):
            overwrite = True
        else:
            overwrite = False
    except:
        overwrite = False
    migrate_graphs(argv[1], overwrite)

if __name__ == '__main__':
    main(sys.argv)