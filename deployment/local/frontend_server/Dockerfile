FROM node:latest

LABEL project=skrik

WORKDIR /usr/web/skrik
COPY frontend/docs/ ./docs/
COPY frontend/public/ ./public/
COPY frontend/src/ ./src/
COPY frontend/package-lock.json ./package-lock.json
COPY frontend/package.json ./package.json

RUN echo "HOST=frontend" > ./.env.development

RUN yarn

CMD ["yarn", "start"]