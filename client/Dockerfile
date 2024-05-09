FROM node:20.1.0 

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY --chown=node:node . /app

EXPOSE 8080

CMD ["npm","run","dev"]
