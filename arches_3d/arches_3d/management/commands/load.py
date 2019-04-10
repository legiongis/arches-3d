import os
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings

import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('operation',
                            choices=['full'],
                            help='Operation Type; ' +
                                 '\'full\'=Loads reference data and resource graphs.')

    def handle(self, *args, **options):
        if options['operation'] == 'full':
            call_command('packages',operation="setup_db")
            self.load_reference_data()
            call_command('packages',operation="import_graphs")

    def load_reference_data(self):
        thesauri = os.path.join(settings.APP_ROOT,"db","schemes","thesauri")
        for f in os.listdir(thesauri):
            if f.endswith(".rdf"):
                call_command("packages",operation="import_reference_data",
                    source=os.path.join(thesauri,f))
        
        collections = os.path.join(settings.APP_ROOT,"db","schemes","collections")
        for f in os.listdir(collections):
            if f.endswith(".rdf"):
                call_command("packages",operation="import_reference_data",
                    source=os.path.join(collections,f))
