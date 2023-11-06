// tcp-server.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const http = require('http');
const WebSocket = require('ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// Define your GraphQL schema and resolvers
const typeDefs = gql`
  type Query {
    message: String
  }
`;

const resolvers = {
  Query: {
    message: () => 'Hello from GraphQL'
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set up ApolloServer
const apolloServer = new ApolloServer({ schema });

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log(`Received message => ${message}`);
    });
    ws.send('WebSocket connection established');
  });

  server.listen(4000, () => {
    console.log(`Server running on http://localhost:4000${apolloServer.graphqlPath}`);
  });
});

// Importing the UDP dummy data emitter
const udpServer = require('../udp/server');

// Integration with the UDP server
udpServer.on('message', (message, rinfo) => {
  console.log(`UDP server got: ${message} from ${rinfo.address}:${rinfo.port}`);
  // Broadcast the message to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
});