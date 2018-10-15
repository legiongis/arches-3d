import os

from pathos.pools import ProcessPool

from django.core.files.uploadedfile import SimpleUploadedFile
from storages.backends.azure_storage import AzureStorage

from zipfile import BadZipfile, ZipFile
import mimetypes

from arches_3d.arches_3d import settings


class Arches3dCustomStorage(AzureStorage):

    def _save(self, name, content):
        actual_file_name = super(Arches3dCustomStorage, self)._save(name, content)
        original_filepath, file_extension = os.path.splitext(actual_file_name)
        
        if file_extension == '.zip':
            self.extract_and_save_zip(actual_file_name, content, original_filepath)

        return actual_file_name

    def extract_and_save_zip(self, actual_file_name, content, original_filepath):
        try:
            print "Unzipping and saving contents of: " + actual_file_name
            input_zip = ZipFile(content)
            
            process_pool_nodes = settings.PROCESS_POOL_NODES
            pool = ProcessPool(process_pool_nodes)
            pool.map(self.save_file, [(zipinfo_file.filename, input_zip.open(zipinfo_file).read(), original_filepath) for zipinfo_file in input_zip.filelist])

            print "Finished saving contents of: " + actual_file_name

        except BadZipfile:
            print "Uploaded file was corrupt"
        except Exception as e:
            print "Upload of zip file failed: "
            print e

    def save_file(self, arguments):
        (filename, content, original_filepath) = arguments
        
        if not self.IsDirectory(filename):
            output_filepath = os.path.join(original_filepath, filename)

            content_type = mimetypes.guess_type(filename)[0]

            memory_file = SimpleUploadedFile(
                name=output_filepath,
                content=content,
                content_type=content_type
            )

            super(Arches3dCustomStorage, self)._save(output_filepath, memory_file)

    def IsDirectory(self, filename):
        return filename.endswith('/')
