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
import { PubSub } from "graphql-subscriptions";

const PORT = 4000;

(async () => {
    const pubsub = new PubSub();

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const app = express();

    const httpServer = createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
    });

    const serverCleanup = useServer(
        { 
            schema, 
            context: (_ctx, _msg, _args) => ({ 
                db, 
                pubsub 
            }),
        }, 
        wsServer
    );

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
        context: ({ req, res }) => ({req, res, db, pubsub}),
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