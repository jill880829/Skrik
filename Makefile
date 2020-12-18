ifneq (,$(wildcard ./.env))
    include .env
    export
endif

db:
	docker-compose --env-file .env -f ./deployment/local/database.yml up

db_clean:
	docker-compose --env-file .env -f ./deployment/local/database.yml down
	docker rmi local_skrik_mongo

dbconn:
	if [ ! -f .env ]; then export $(cat .env | xargs); fi
	mongo --authenticationDatabase admin -u ${MONGO_INITDB_ROOT_USERNAME} localhost:27017/${MONGO_INITDB_DATABASE} -p ${MONGO_INITDB_ROOT_PASSWORD}