#!make
include backend/.env
export $(shell sed 's/=.*//' backend/.env)

NOW := v0.0.1

init:
	envsubst < deployment/local/mongoDB/init.js.example > deployment/local/mongoDB/init.js

db:
	if ! [ -f deployment/local/mongoDB/init.js ]; then \
		echo "run \"make config\" first."; \
		exit 1; \
	fi
	docker-compose -f ./deployment/local/database.yml up

db_docker:
	export NAME=mongo && \
	docker build \
		-f deployment/local/mongoDB/Dockerfile \
		-t us.gcr.io/skrik/$$(echo $$NAME) . && \
	docker tag us.gcr.io/skrik/$$(echo $$NAME) us.gcr.io/skrik/$$(echo $$NAME):$(NOW) && \
	docker push us.gcr.io/skrik/$$(echo $$NAME):$(NOW)
	@echo us.gcr.io/skrik/$$(echo $$NAME):$(NOW)

db_clean:
	docker-compose -f ./deployment/local/database.yml down
	docker rmi local_skrik_mongo

dbconn:
	mongo --authenticationDatabase "${DATABASE}" -u "${USERNAME}" "140.112.243.233:27017/${DATABASE}" -p "${PASSWORD}"

backend:
	cd backend && npm start

backend_docker_local:
	docker-compose -p backend -f ./deployment/local/backend.yml up

backend_docker_local_clean:
	docker-compose -p backend -f ./deployment/local/backend.yml down
	docker rmi backend_skrik_express

.PHONY: backend dbconn db_clean db init