FROM node:16
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY dist .

CMD [ "node", "." ]