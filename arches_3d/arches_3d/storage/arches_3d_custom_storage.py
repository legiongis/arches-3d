from storages.backends.azure_storage import AzureStorage
from django.contrib.staticfiles.storage import StaticFilesStorage
from extract_mixin import ExtractMixin

import logging

logger = logging.getLogger(__name__)


class Arches3dCustomStorage(ExtractMixin, AzureStorage):
    pass

class Arches3dCustomStorageStatic(StaticFilesStorage, AzureStorage):
    def _save(self, name, content):
        logger.info("Saving static file {0} to both local storage and Azure".format(name))
        StaticFilesStorage()._save(name, content)
        AzureStorage()._save(name, content)
