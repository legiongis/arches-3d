from storages.backends.azure_storage import AzureStorage
from static_compress.mixin import CompressMixin
from extract_mixin import ExtractMixin


class Arches3dCustomStorage(ExtractMixin, AzureStorage):
    pass
