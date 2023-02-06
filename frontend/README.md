# Frontend for Dentist Voice-Controlled Assistant Web Application

## Install

For the installation, you need to run the following command in your terminal

```sh
npm install
```

## Running Server in Development Mode

For runnning the server (in development mode), you can run the following command in your terminal

```sh
npm start
```

In addition, you can change the running port by changing the PORT variable in config.env (default port = 5000)

### Error:

#### `Module not found: Error: Can't resolve 'fs'`

You should go to `./node_modules/@tensorflow-models/speech-commands/package.json` and `./node_modules/nested-json-to-table/package.json`, then just simply add the below line in both `package.json` files.

```
"browser": { "fs": false }
```
