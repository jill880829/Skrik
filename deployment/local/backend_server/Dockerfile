FROM node:latest
LABEL project=skrik

RUN apt update && apt install -y zip

WORKDIR /usr/web/skrik
COPY backend/bin/ ./bin/
COPY backend/public/ ./public/
COPY backend/routes/ ./routes/
COPY backend/utils/ ./utils/
COPY backend/app.js ./app.js
COPY backend/package-lock.json ./package-lock.json
COPY backend/package.json ./package.json

RUN mkdir tmp

RUN npm install

CMD ["npm", "start"]