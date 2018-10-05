#!/bin/bash

ENTRYPOINT_DIR=${ENTRYPOINT_DIR:-../docker}
source ${ENTRYPOINT_DIR}/arches_setup_functions.sh

import_concepts

import_collections