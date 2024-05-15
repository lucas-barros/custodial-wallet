#!/bin/bash

npm run db:migrate
npm run start:${NODE_ENV}