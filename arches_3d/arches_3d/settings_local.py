import os
from django.core.exceptions import ImproperlyConfigured
import ast
import requests
import sys
from settings import *

def get_env_variable(var_name):
    msg = "Set the %s environment variable"
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = msg % var_name
        raise ImproperlyConfigured(error_msg)

def get_optional_env_variable(var_name):
    try:
        return os.environ[var_name]
    except KeyError:
        return None

MODE = get_env_variable('DJANGO_MODE') #options are either "PROD" or "DEV" (installing with Dev mode set, get's you extra dependencies)
DEBUG = ast.literal_eval(get_env_variable('DJANGO_DEBUG'))

COUCHDB_URL = 'http://{}:{}@{}:{}'.format(get_env_variable('COUCHDB_USER'), get_env_variable('COUCHDB_PASS'),get_env_variable('COUCHDB_HOST'), get_env_variable('COUCHDB_PORT')) # defaults to localhost:5984

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': get_env_variable('PGDBNAME'),
        'USER': get_env_variable('PGUSERNAME'),
        'PASSWORD': get_env_variable('PGPASSWORD'),
        'HOST': get_env_variable('PGHOST'),
        'PORT': get_env_variable('PGPORT'),
        'POSTGIS_TEMPLATE': 'template_postgis_20',
    }
}

ELASTICSEARCH_HTTP_PORT = get_env_variable('ESPORT')
ELASTICSEARCH_HOSTS = [
    { 'host': get_env_variable('ESHOST'), 'port': ELASTICSEARCH_HTTP_PORT }
]

USER_ELASTICSEARCH_PREFIX = get_optional_env_variable('ELASTICSEARCH_PREFIX')
if USER_ELASTICSEARCH_PREFIX:
    ELASTICSEARCH_PREFIX = USER_ELASTICSEARCH_PREFIX

ALLOWED_HOSTS = get_env_variable('DOMAIN_NAMES').split()

USER_SECRET_KEY = get_optional_env_variable('DJANGO_SECRET_KEY')
if USER_SECRET_KEY:
    # Make this unique, and don't share it with anybody.
    SECRET_KEY = USER_SECRET_KEY

STATIC_ROOT = '/static_root'
STATIC_URL = get_optional_env_variable('STATIC_URL') or '/media/'

AZURE_ACCOUNT_NAME = get_env_variable('AZURE_ACCOUNT_NAME')
AZURE_ACCOUNT_KEY = get_env_variable('AZURE_ACCOUNT_KEY')
AZURE_CONTAINER = get_optional_env_variable('AZURE_CONTAINER') or 'arches'
AZURE_SSL = get_optional_env_variable('AZURE_SSL') or False
AZURE_UPLOAD_MAX_CONN = get_optional_env_variable('AZURE_UPLOAD_MAX_CONN') or 2
AZURE_CONNECTION_TIMEOUT_SECS = get_optional_env_variable('AZURE_CONNECTION_TIMEOUT_SECS') or 99999
AZURE_BLOB_MAX_MEMORY_SIZE = get_optional_env_variable('AZURE_BLOB_MAX_MEMORY_SIZE') or '2MB'
AZURE_URL_EXPIRATION_SECS = get_optional_env_variable('AZURE_URL_EXPIRATION_SECS') or None
AZURE_OVERWRITE_FILES = get_optional_env_variable('AZURE_OVERWRITE_FILES') or False