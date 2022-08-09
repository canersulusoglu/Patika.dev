import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/'
});

const wsLink = typeof window !== "undefined" ? 
  new GraphQLWsLink(
    createClient({
        url: "ws://localhost:4000/",
    })
  )
  : null;

const splitLink = typeof window !== "undefined" && wsLink != null ? 
  split(
    ({ query }) => {
        const def = getMainDefinition(query);
        return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
        );
    },
    wsLink,
    httpLink
  )
  : httpLink;

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default apolloClient;