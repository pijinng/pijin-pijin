const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
require('dotenv').config();

const users = require('./controllers/users');

const server = new grpc.Server();
const packageDefinition = protoLoader.loadSync(process.env.PROTO_LOCATION);
const appService = grpc.loadPackageDefinition(packageDefinition).pijin.Pijin.service;
server.addService(appService, users);
server.bind(`0.0.0.0:${process.env.SERVICE_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();
console.info(`Pijin Pijin service started successfully on 0.0.0.0:${process.env.SERVICE_PORT}`);
