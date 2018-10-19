import os
import traceback

import multiprocessing
from pathos.pools import ProcessPool

from django.core.files.uploadedfile import SimpleUploadedFile
from storages.backends.azure_storage import AzureStorage

from zipfile import BadZipfile, ZipFile
import mimetypes

import tempfile
import shutil

from arches_3d import settings


class Arches3dCustomStorage(AzureStorage):

    def _save(self, name, content):
        actual_file_name = super(Arches3dCustomStorage, self)._save(name, content)
        original_filepath, file_extension = os.path.splitext(actual_file_name)
        
        if file_extension == '.zip':
            self.extract_and_save_zip(actual_file_name, content, original_filepath)

        return actual_file_name

    def extract_and_save_zip(self, actual_file_name, content, original_filepath):
        temp_dir = tempfile.mkdtemp()
        
        try:
            print "Unzipping and saving contents of: {0}".format(actual_file_name)
            self.extract_file(content, temp_dir)
            
            num_workers = multiprocessing.cpu_count() - 1
            print "Processing archive contents with a process pool of {0} nodes".format(num_workers)
            pool = ProcessPool(num_workers)

            filepaths = [os.path.join(os.path.relpath(root, temp_dir), filename) for root, _, filenames in os.walk(temp_dir) for filename in filenames]
            file_count = len(filepaths)
            chunksize, rest = divmod(file_count, 4 * num_workers)
            if rest:
                chunksize += 1
            print "Processing workload in chunks of: {0}".format(chunksize)

            arguments = [(temp_dir, filepaths, original_filepath) for filepaths in filepaths]
            pool.map(self.save_file, arguments, chunksize = chunksize)

            print "Finished saving contents of: " + actual_file_name

        except BadZipfile:
            print "Uploaded file was corrupt"
            raise
        except Exception as e:
            print "Upload of zip file failed: "
            print e
            print traceback.format_exc()
            raise
        finally:
            shutil.rmtree(temp_dir)

    def save_file(self, arguments):
        (temp_dir, relative_filepath, original_filepath) = arguments
        
        input_filepath = os.path.join(temp_dir, relative_filepath)
        output_filepath = os.path.join(original_filepath, relative_filepath)

        content_type = mimetypes.guess_type(input_filepath)[0]

        memory_file = SimpleUploadedFile(
            name=output_filepath,
            content=open(input_filepath).read(),
            content_type=content_type
        )

        super(Arches3dCustomStorage, self)._save(output_filepath, memory_file)

    @staticmethod
    def extract_file(content, target_dir):
        input_zip = ZipFile(content)
        try:
            input_zip.extractall(target_dir)
        except:
            print "Failed to extract zipfile"
        finally:
            input_zip.close()
