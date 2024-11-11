# Bitcoin custodial wallet

The purpose of this project is to create a small custodial wallet app that demos an end-to-end purchase of bitcoin with fiat.

## Application breakdown
The client application is built with react, vite and next-ui, a component library that builds on top of Tailwind CSS. 
The backend is build with nodejs, express, sequelize and some other utility libraries. Postgres for data persistence and bitcoin core node to interact with local private network. Docker was used to facilitate development and deployment of the solution.

When the server application starts, it will try to load the application wallet if it exists, if it does not it will create one with `createwallet` RPC command and mine enough blocks to receive initial reward with `generatetoaddress`. Those funds will later be used when users go through the purchase flow.

Upon user creation, the backend will create a key pair and store a p2wpkh public address and encrypted private key. The public address is used to received bitcoin purchased by the user and the encrypted key is not utilized at the moment.

After login in, the user will be able to connect with fiat bank accounts through plaid. Once connected, the user can then select one of their connected accounts and exchange fiat for bitcoin. The backend will use `sendtoaddress` RPC command to send bitcoin to the user's public address. The user's bitcoin balance is retrieved by using `scantxoutset` command.

## How to run locally
1) Install docker v26
2) Copy .env.sample to .env and fill in missing environment variable, mainly plaid sandbox and coin gecko api keys.
3) Run `docker compose up` or `docker-compose up` depending on your version
 
## How to develop
You can run `docker compose up --watch` for client and server hot reload.

## Code Structure
```
├── client - Client web application built with react
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   └── providers
├── server - Nodejs server
│   └── src
│       ├── application
│       │   ├── controllers
│       │   ├── middlewares
│       │   ├── routers
│       │   └── services
│       ├── domain
│       │   ├── entities
│       │   └── repositories
│       └── infrastructure
│           └── database
│               ├── migrations
│               └── models
```