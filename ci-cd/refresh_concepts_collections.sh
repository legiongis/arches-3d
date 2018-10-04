#!/bin/bash

ENTRYPOINT_DIR=${ENTRYPOINT_DIR:-../docker}
source ${ENTRYPOINT_DIR}/arches_3d_entrypoint.sh

import_concepts

import_collections