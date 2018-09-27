const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
require('dotenv').config();

const users = require('./controllers/users');
const entries = require('./controllers/entries');

const server = new grpc.Server();
const packageDefinition = protoLoader.loadSync(process.env.PROTO_LOCATION);
const { service } = grpc.loadPackageDefinition(packageDefinition).pijin.Pijin;

server.addService(service, { ...users, ...entries });

server.bind(`0.0.0.0:${process.env.SERVICE_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();
console.info(`Pijin Pijin service started successfully on port ${process.env.SERVICE_PORT}`);
