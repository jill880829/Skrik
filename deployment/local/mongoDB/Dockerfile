FROM mongo:latest

LABEL project=skrik

COPY ./deployment/local/mongoDB/init.js /docker-entrypoint-initdb.d/
RUN chmod -R 775 /docker-entrypoint-initdb.d
