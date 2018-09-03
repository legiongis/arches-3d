FROM archesproject/arches:4.2.0

ENV YARN_DIR=${WEB_ROOT}/cvast_arches/cvast_arches
ENV ENTRYPOINT_DIR=/docker/entrypoint

RUN . ${WEB_ROOT}/ENV/bin/activate &&\
    pip install boto django-storages

COPY ./cvast_arches ${WEB_ROOT}/cvast_arches
COPY ./docker/entrypoint /docker/entrypoint

WORKDIR ${YARN_DIR}
RUN yarn install

RUN chmod -R 700 ${ENTRYPOINT_DIR} &&\
    dos2unix ${ENTRYPOINT_DIR}/*

# Set default workdir
WORKDIR ${WEB_ROOT}/cvast_arches