FROM node:18-alpine3.15

ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --production

COPY random-names/ random-names/
COPY src/ src/
COPY tsconfig.json index.ts generateData.ts ./

RUN mkdir data && yarn run generate

EXPOSE 3000

ENTRYPOINT [ "yarn", "run", "start" ]
