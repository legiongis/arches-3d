FROM globaldigitalheritage/arches:4.3.1.1

ENV APP_DIR=${WEB_ROOT}/arches_3d/arches_3d
ENV YARN_DIR=${APP_DIR}
ENV ENTRYPOINT_DIR=/docker/entrypoint

COPY ./arches_3d/arches_3d/install/requirements.txt ${APP_DIR}/install/requirements.txt
RUN	. ${WEB_ROOT}/ENV/bin/activate &&\
	pip install -r ${APP_DIR}/install/requirements.txt

COPY ./arches_3d ${WEB_ROOT}/arches_3d
COPY ./docker/arches_3d_entrypoint.sh ${ENTRYPOINT_DIR}/arches_3d_entrypoint.sh

WORKDIR ${YARN_DIR}
RUN yarn install

RUN chmod -R 700 ${ENTRYPOINT_DIR} &&\
    dos2unix ${ENTRYPOINT_DIR}/*

# Set default workdir
WORKDIR ${WEB_ROOT}/arches_3d