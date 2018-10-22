import os
import traceback

import multiprocessing
from pathos.pools import ProcessPool

from django.core.files.uploadedfile import SimpleUploadedFile
from storages.backends.azure_storage import AzureStorage

from zipfile import BadZipfile, ZipFile
import mimetypes
import chardet

import tempfile
import shutil

import logging

from arches_3d import settings

logger = logging.getLogger(__name__)

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
            logger.info("Unzipping and saving contents of: {0}".format(actual_file_name))
            self.extract_file(content, temp_dir)
            
            num_workers = multiprocessing.cpu_count() - 1
            logger.debug("Processing archive contents with a process pool of {0} nodes".format(num_workers))
            pool = ProcessPool(num_workers)

            filepaths = [os.path.join(os.path.relpath(root, temp_dir), filename) for root, _, filenames in os.walk(temp_dir) for filename in filenames]
            file_count = len(filepaths)
            chunksize, rest = divmod(file_count, 4 * num_workers)
            if rest:
                chunksize += 1
            logger.debug("Processing workload in chunks of: {0}".format(chunksize))

            arguments = [(temp_dir, filepaths, original_filepath) for filepaths in filepaths]
            pool.map(self.save_file, arguments, chunksize = chunksize)

            logger.info("Finished saving contents of: " + actual_file_name)

        except BadZipfile:
            logger.error("Uploaded file was corrupt")
            raise
        except Exception as e:
            logger.error("Upload of zip file failed: [{0}]".format(e))
            raise
        finally:
            shutil.rmtree(temp_dir)

    def save_file(self, arguments):
        (temp_dir, relative_filepath, original_filepath) = arguments
        
        input_filepath = os.path.join(temp_dir, relative_filepath)
        output_filepath = os.path.join(original_filepath, relative_filepath)

        content_type = mimetypes.guess_type(input_filepath)[0]

        try_again = True
        encoding = None
        while try_again:
            try:
                memory_file = self.createMemoryFile(output_filepath, input_filepath, content_type, encoding)
                super(Arches3dCustomStorage, self)._save(output_filepath, memory_file)
                try_again = False
            except UnicodeDecodeError as e:
                logger.error("Failed to save file: {0}".format(input_filepath))
                logger.error(e)
                logger.info("Retrying with detected encoding")
                detected = chardet.detect(open(input_filepath, "rb").read())
                logger.debug("detected")
                logger.debug(detected)
                encoding = detected.encoding
                logger.debug("encoding")
                logger.debug(encoding)
            except Exception as e:
                logger.error("Failed to save file: {0}".format(input_filepath))
                logger.error(e)
                raise

    @staticmethod
    def createMemoryFile(output_filepath, input_filepath, content_type, encoding=None):
        if encoding:
            content = open(input_filepath, encoding=encoding)
        else:
            content = open(input_filepath)

        memory_file = SimpleUploadedFile(
            name=output_filepath,
            content=content.read(),
            content_type=content_type
        )
        return memory_file

    @staticmethod
    def extract_file(content, target_dir):
        input_zip = ZipFile(content)
        try:
            input_zip.extractall(target_dir)
        except Exception as e:
            logger.error("Failed to extract zipfile: [{0}]".format(e))
            raise
        finally:
            input_zip.close()
