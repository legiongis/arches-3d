import os.path
from azure.storage.common import CloudStorageAccount
from django.core.management.base import BaseCommand
from arches.app.models.system_settings import settings


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('operation', nargs='?',
                            choices=['fix_static_paths'],
                            help='Operation Type; ' +
                                 '\'fix_static_paths\'=Fixes static file paths that are uploaded to blob storage '
                                 'without their special characters')

    def handle(self, *args, **options):
        if options['operation'] == 'fix_static_paths':
            print 'Fixing static file paths with special characters'
            azure_storage_service = AzureStorageService()
            azure_storage_service.fix_blob_paths()


class AzureStorageService:
    def __init__(self):
        self.account = CloudStorageAccount(account_name=settings.AZURE_ACCOUNT_NAME,
                                           account_key=settings.AZURE_ACCOUNT_KEY)
        self.block_blob_service = self.account.create_block_blob_service()
        self.container_name = 'arches'

        self.blobs_that_need_fixing = {'packages/mapbox/': 'packages/@mapbox/', 'packages/turf/': 'packages/@turf/'}

    def fix_blob_paths(self):
        for origin_prefix, target_prefix in self.blobs_that_need_fixing.iteritems():
            blobs_under_prefix = self.block_blob_service.list_blobs(self.container_name, prefix=origin_prefix)
            for blob in blobs_under_prefix:
                target_blob_name = self.resolve_target_blob_name(blob, origin_prefix, target_prefix)
                if not self.block_blob_service.exists(self.container_name, target_blob_name):
                    self.copy_blob(blob.name, target_blob_name)
                else:
                    print "Already exists: {target_blob_name}".format(target_blob_name=target_blob_name)

    def resolve_target_blob_name(self, blob, origin_prefix, target_prefix):
        path_after_prefix = os.path.relpath(blob.name, origin_prefix)
        return target_prefix + path_after_prefix

    def copy_blob(self, origin_blob_name, target_blob_name):
        print 'Copying: {origin_blob_name}'.format(origin_blob_name=origin_blob_name)
        print 'Target location: {target_blob_name}'.format(target_blob_name=target_blob_name)

        source_url = self.make_blob_url(origin_blob_name)
        self.block_blob_service.copy_blob(self.container_name, target_blob_name, source_url)

        # self.block_blob_service.delete_blob(self.container_name, target_url)

    def make_blob_url(self, blob_name):
        return self.block_blob_service.make_blob_url(self.container_name, blob_name)
