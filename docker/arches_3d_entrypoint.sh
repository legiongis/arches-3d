#!/bin/bash


APP_FOLDER=${WEB_ROOT}/${ARCHES_PROJECT}
THESAURI_FOLDER=${APP_FOLDER}/arches_3d/db/schemes/thesauri
COLLECTIONS_FOLDER=${APP_FOLDER}/arches_3d/db/schemes/collections
FIX_STATIC_PATHS_SCRIPT=${APP_FOLDER}/arches_3d/install/fix_static_paths.py


cd_app_folder() {
	cd ${APP_FOLDER}
	echo "Current work directory: ${APP_FOLDER}"
}


init_custom_db() {
	
	cd_app_folder

	# Import graphs
	if ! graphs_exist; then
		echo "Running: python manage.py packages -o import_graphs"
		python manage.py packages -o import_graphs
	else
		echo "Graphs already exist in the database. Skipping..."
	fi
	
	# Import concepts
	if ! concepts_exist; then
	    for file_path in ${THESAURI_FOLDER}/*.rdf; do
	        import_reference_data ${file_path}
        done
	else
		echo "Concepts already exist in the database. Skipping..."
	fi
	
	# Import collections
	if ! collections_exist; then
        for file_path in ${COLLECTIONS_FOLDER}/*.rdf; do
	        import_reference_data ${file_path}
        done
	else
		echo "collections already exist in the database. Skipping..."
	fi
	
}

graphs_exist() {
	row_count=$(psql --host=${PGHOST} --port=${PGPORT} --user=${PGUSERNAME} --dbname=${PGDBNAME} -Atc "SELECT COUNT(*) FROM public.graphs")
	if [[ ${row_count} -le 3 ]]; then
		return 1
	else 
		return 0
	fi
}

concepts_exist() {
	row_count=$(psql --host=${PGHOST} --port=${PGPORT} --user=${PGUSERNAME} --dbname=${PGDBNAME} -Atc "SELECT COUNT(*) FROM public.concepts WHERE nodetype = 'Concept'")
	if [[ ${row_count} -le 2 ]]; then
		return 1
	else 
		return 0
	fi
}

collections_exist() {
	row_count=$(psql --host=${PGHOST} --port=${PGPORT} --user=${PGUSERNAME} --dbname=${PGDBNAME} -Atc "SELECT COUNT(*) FROM public.concepts WHERE nodetype = 'Collection'")
	if [[ ${row_count} -le 1 ]]; then
		return 1
	else 
		return 0
	fi
}

import_reference_data() {
	# Import example concept schemes
	local rdf_file="$1"
	echo "Running: python manage.py packages -o import_reference_data -s \"${rdf_file}\""
	python manage.py packages -o import_reference_data -s "${rdf_file}"
}

fix_static_paths() {
    echo "Running: python manage.py azure_storage_service fix_static_paths"
    python manage.py azure_storage_service fix_static_paths
}

init_custom_db

if [[ ! -z ${AZURE_ACCOUNT_NAME} ]]; then
    fix_static_paths
fi




