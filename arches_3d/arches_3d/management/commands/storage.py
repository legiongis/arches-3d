from django.core.management.base import BaseCommand
from arches_3d.storage.azure_storage_service import AzureStorageService

import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('operation', nargs='?',
                            choices=['fix_static_paths'],
                            help='Operation Type; ' +
                                 '\'fix_static_paths\'=Fixes static file paths that are uploaded to blob storage '
                                 'without their special characters')

    def handle(self, *args, **options):
        if options['operation'] == 'fix_static_paths':
            logger.info('Fixing static file paths with special characters')
            azure_storage_service = AzureStorageService()
            azure_storage_service.fix_blob_paths()
