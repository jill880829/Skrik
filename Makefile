MONGO_USERNAME=skrik
MONGO_DATABASE=skrik
MONGO_PASSWORD=qrghfvbhfggiyreghruqoqhfriegyireygr
db:
	docker-compose -f ./deployment/local/database.yml up

db_clean:
	docker-compose --f ./deployment/local/database.yml down
	docker rmi local_skrik_mongo

dbconn:
	mongo --authenticationDatabase $(MONGO_DATABASE) -u $(MONGO_USERNAME) localhost:27017/$(MONGO_DATABASE) -p $(MONGO_PASSWORD)