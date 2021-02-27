FROM node:14-alpine as base

WORKDIR /
COPY package*.json /
EXPOSE 3001

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["npm", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /
CMD ["npm", "start"]