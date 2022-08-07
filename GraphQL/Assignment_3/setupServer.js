const { createServer } = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault
} = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema")
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const setupServer = async (typeDefs, resolvers, PORT) => {
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const app = express();
    const httpServer = createServer(app);
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/',
    });
    const serverCleanup = useServer({ schema }, wsServer);
    const server = new ApolloServer({
      schema,
      plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer }),
          {
            async serverWillStart() {
              return {
                async drainServer() {
                  await serverCleanup.dispose();
                },
              };
            },
          },
          ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ]
    });
    await server.start();
    server.applyMiddleware({ 
      app, 
      path: "/"
    });
    httpServer.listen(PORT, () => {
      console.log(
        `🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
}

module.exports = setupServer;