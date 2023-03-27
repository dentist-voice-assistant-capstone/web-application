FROM node:18.3.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g node-pre-gyp
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]