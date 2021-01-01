#!make
include backend/.env
export $(shell sed 's/=.*//' backend/.env)

NOW := v0.0.1
PROJECT_ID := skrik-299012

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
		-t asia.gcr.io/$(PROJECT_ID)/$$(echo $$NAME) . && \
	docker tag asia.gcr.io/$(PROJECT_ID)/$$(echo $$NAME) asia.gcr.io/$(PROJECT_ID)/$$(echo $$NAME):$(NOW) && \
	docker push asia.gcr.io/$(PROJECT_ID)/$$(echo $$NAME):$(NOW)
	@echo asia.gcr.io/$(PROJECT_ID)/$$(echo $$NAME):$(NOW)

db_clean:
	docker-compose -f ./deployment/local/database.yml down
	docker rmi local_skrik_mongo

dbconn:
	mongo --authenticationDatabase "${DATABASE}" -u "${USERNAME}" "${DBURL}/${DATABASE}" -p "${PASSWORD}"

backend:
	export $(cat backend/.env | xargs) && cd backend && npm start

backend_yarn:
	export $(cat backend/.env | xargs) && cd backend && yarn start

backend_docker_local:
	docker-compose -p backend -f ./deployment/local/backend.yml up

backend_docker_local_clean:
	docker-compose -p backend -f ./deployment/local/backend.yml down
	docker rmi backend_skrik_express

cert:
	certbot certonly --manual -d skrik.net
	cp /etc/letsencrypt/live/skrik.net/privkey.pem deployment/k8s/secret/
	cp /etc/letsencrypt/live/skrik.net/fullchain.pem deployment/k8s/secret/
	chown chris deployment/k8s/secret/privkey.pem
	chown chris deployment/k8s/secret/fullchain.pem

cert_deploy:
	kubectl create secret tls letsencrypt-cert --cert=deployment/k8s/secret/fullchain.pem --key=deployment/k8s/secret/privkey.pem

cert_destroy:
	kubectl delete secret letsencrypt-cert

cert_renew:
	certbot renew

.PHONY: backend dbconn db_clean db init