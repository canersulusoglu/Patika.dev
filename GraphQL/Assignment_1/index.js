const { ApolloServer, gql } = require("apollo-server");
const { ApolloServerPluginLandingPageLocalDefault } = require("apollo-server-core");
const {
    users, 
    events, 
    locations,
    participants 
} = require("./data.json");

const typeDefs = gql`
    type User {
        id: Int!
        username: String
        email: String
        events: [Event]
    }

    type Event {
        id: Int!,
        title: String
        desc: String
        date: String
        from: String
        to: String
        location_id: Int!
        user_id: Int!
        user: User
        participants: [Participant]
        location: Location
    }
    
    type Location {
        id: Int!
        name: String
        desc: String
        lat: Float
        lng: Float
    }

    type Participant {
        id: Int!
        user_id: Int!
        event_id: Int!
        user: User
        event: Event
    }

    type Query {
        users: [User]
        user(id: Int!): User

        events: [Event]
        event(id: Int): Event

        locations: [Location]
        location(id: Int): Location

        participants: [Participant]
        participant(id: Int): Participant
    }
`;

const resolvers = {
    Query: {
        users: () => users,
        user: (_parent, args) => users.find(x => x.id === args.id),

        events: () => events,
        event: (_parent, args) => events.find(x => x.id === args.id),

        locations: () => locations,
        location: (_parent, args) => locations.find(x => x.id === args.id),

        participants: () => participants,
        participant: (_parent, args) => participants.find(x => x.id === args.id)
    },
    User: {
        events: (parent, _args) => events.filter(x => x.user_id === parent.id)
    },
    Event: {
        user: (parent, _args) => users.find(x => x.id === parent.user_id),
        participants: (parent, _args) => participants.filter(x => x.event_id === parent.id),
        location: (parent, _args) => locations.find(x => x.id === parent.location_id)
    },
    Participant: {
        user: (parent, _args) => users.find(x => x.id === parent.user_id),
        event: (parent, _args) => events.find(x => x.id === parent.event_id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({embed: true})
    ]
});

server.listen().then((serverInfo) => {
    console.log(`🚀  Server ready at ${serverInfo.url}`);
});