import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import db from './data.json';

const PORT = 4000;

(async () => {
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
        ],
        context: {
            db
        }
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
})()