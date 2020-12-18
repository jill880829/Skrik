FROM mongo:latest

LABEL project=skrik

COPY init.js /docker-entrypoint-initdb.d/
RUN chmod -R 775 /docker-entrypoint-initdb.d
