#!make
include backend/.env
export $(shell sed 's/=.*//' backend/.env)

NOW := v0.0.3
PROJECT_ID := skrik-299012

init:
	envsubst < deployment/local/mongoDB/init.js.example > deployment/local/mongoDB/init.js

db:
	if ! [ -f deployment/local/mongoDB/init.js ]; then \
		echo "run \"make config\" first."; \
		exit 1; \
	fi
	docker-compose -f ./deployment/local/database.yml up

db_clean:
	docker-compose -f ./deployment/local/database.yml down
	docker rmi local_skrik_mongo

dbconn:
	mongo --authenticationDatabase "$(MONGO_DATABASE)" -u "$(MONGO_USERNAME)" "$(MONGO_URL)/$(MONGO_DATABASE)" -p "$(MONGO_PASSWORD)"

backend:
	export $$(cat backend/.env | xargs) && export MONGO_USERNAME="$(MONGO_USERNAME)" && cd backend && npm start

backend_yarn:
	export $$(cat backend/.env | xargs) && export MONGO_USERNAME="$(MONGO_USERNAME)" && cd backend && yarn start

deploy_db_build:
	export DOCKER_NAME=mongo && \
	docker build \
		-f deployment/local/mongoDB/Dockerfile \
		-t asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME) . && \
	docker tag asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME) asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW) && \
	docker push asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW) && \
	echo asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW)

deploy_backend_build:
	export DOCKER_NAME=backend && \
	docker build \
		-f deployment/local/backend_server/Dockerfile \
		-t asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME) . && \
	docker tag asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME) asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW) && \
	docker push asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW) && \
	echo asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW)

deploy_frontend_build:
	export DOCKER_NAME=frontend && \
	docker build \
		-f deployment/local/frontend_server/Dockerfile \
		-t asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME) . && \
	docker tag asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME) asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW) && \
	docker push asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW) && \
	echo asia.gcr.io/$(PROJECT_ID)/$$(echo $$DOCKER_NAME):$(NOW)

deploy_backend_conf:
	kubectl delete secret backend-secret
	kubectl create secret generic backend-secret \
		--from-literal=MONGO_USERNAME="$(MONGO_USERNAME)" \
		--from-literal=MONGO_PASSWORD="$(MONGO_PASSWORD)" \
		--from-literal=MONGO_DATABASE="$(MONGO_DATABASE)" \
		--from-literal=PROJECT_SECRET="$(PROJECT_SECRET)" \
		--from-literal=SESSION_SECRET="$(SESSION_SECRET)" \
		--from-literal=FB_APP_ID="$(FB_APP_ID)" \
		--from-literal=FB_APP_SECRET="$(FB_APP_SECRET)" \
		--from-literal=GOOGLE_APP_ID="$(GOOGLE_APP_ID)" \
		--from-literal=GOOGLE_APP_SECRET="$(GOOGLE_APP_SECRET)" \
		--from-literal=GITHUB_APP_ID="$(GITHUB_APP_ID)" \
		--from-literal=GITHUB_APP_SECRET="$(GITHUB_APP_SECRET)" \
		--from-literal=REDIS_PASSWORD="$(REDIS_PASSWORD)"

deploy_db_conf:
	kubectl delete secret mongo-secret
	kubectl create secret generic mongo-secret \
		--from-literal=MONGO_INITDB_ROOT_USERNAME="$(MONGO_INITDB_ROOT_USERNAME)" \
		--from-literal=MONGO_INITDB_ROOT_PASSWORD="$(MONGO_INITDB_ROOT_PASSWORD)" \
		--from-literal=MONGO_INITDB_DATABASE="$(MONGO_INITDB_DATABASE)"

deploy_redis_conf:
	kubectl delete secret redis-secret
	kubectl create secret generic redis-secret \
		--from-literal=redis.conf="requirepass $(REDIS_PASSWORD)"

deploy_mongo_express_conf:
	kubectl delete secret mongo-express-secret
	kubectl create secret generic mongo-express-secret \
		--from-literal=ME_CONFIG_MONGODB_ADMINUSERNAME="$(MONGO_INITDB_ROOT_USERNAME)" \
		--from-literal=ME_CONFIG_MONGODB_ADMINPASSWORD="$(MONGO_INITDB_ROOT_PASSWORD)" \
		--from-literal=ME_CONFIG_BASICAUTH_USERNAME="$(MONGO_WEB_USERNAME)" \
		--from-literal=ME_CONFIG_BASICAUTH_PASSWORD="$(MONGO_WEB_PASSWORD)"

cert:
	certbot certonly --manual -d skrik.net

cert_fetch:
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