FROM node:18-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm run build

# Resolve Module not found: Error: Can't resolve 'fs'
RUN sed -i '$ d' node_modules/@tensorflow-models/speech-commands/package.json
RUN echo ",\"browser\": { \"fs\": false }}" >> node_modules/@tensorflow-models/speech-commands/package.json

COPY . .

EXPOSE 5000

CMD ["serve", "-l 5000", "-s build"]