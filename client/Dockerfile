FROM node:20.1.0 

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

ENTRYPOINT [ "bash","./startup.sh" ]

