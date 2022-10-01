# Backend API for Dentist Web Application
## Description
This folder contains code (ExpressJS) for running an backend API. [API Doc](https://documenter.getpostman.com/view/19423217/2s83tCMDkT)
## Install
For the installation, you need to run the following command in your terminal
```sh
# This will install all the dependency module
npm install
npm install -g nodemon
```
## Running server
For running the server, you can run the following command
```sh
npm run start:dev
```
In addition, you can change the running port by changing the PORT variable in config.env (default port = 3000)
## Validate
It is recommended to validate the API by using Postman
```sh
# Example Route
127.0.0.1:3000/register
```