FROM node:20.1.0 

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json .

COPY --chown=node:node --chmod=755 startup.sh .

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

ENTRYPOINT [ "bash","./startup.sh" ]
