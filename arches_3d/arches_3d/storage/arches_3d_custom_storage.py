import os

from django.core.files.uploadedfile import SimpleUploadedFile
from storages.backends.azure_storage import AzureStorage

from zipfile import BadZipfile, ZipFile
import mimetypes


class Arches3dCustomStorage(AzureStorage):

    def _save(self, name, content):
        actual_file_name = super(Arches3dCustomStorage, self)._save(name, content)
        filepath, file_extension = os.path.splitext(actual_file_name)
        
        if file_extension == '.zip':
            try:
                print "Unzipping and saving contents of: " + actual_file_name
                input_zip = ZipFile(content)
                for file in input_zip.filelist:
                    if not self.IsDirectory(file):
                        output_filepath = os.path.join(filepath, file.filename)

                        content_type = mimetypes.guess_type(file.filename)[0]
                        content = input_zip.open(file).read()

                        memory_file = SimpleUploadedFile(
                            name=output_filepath,
                            content=content,
                            content_type=content_type
                        )

                        super(Arches3dCustomStorage, self)._save(output_filepath, memory_file)

            except BadZipfile:
                print "Uploaded file was corrupt"
            except Exception as e:
                print "Upload of zip file failed: "
                print e

        return actual_file_name

    def IsDirectory(self, file):
        return file.filename.endswith('/')
