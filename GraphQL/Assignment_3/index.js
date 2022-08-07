const { gql } = require("apollo-server-express");
const { PubSub ,withFilter } = require("graphql-subscriptions");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");
const setupServer = require("./setupServer");
const {
    users, 
    events, 
    locations,
    participants 
} = require("./data.json");

// Pubsub without Redis
const pubsub = new PubSub();

// Pubsub with Redis
/*
const REDIS_OPTIONS = {
  host: "REDIS_DOMAIN_NAME",
  port: "PORT_NUMBER",
  password: "REDIS_PASSWORD",
  retryStrategy: times => {
    return Math.min(times * 50, 2000);
  }
};
const pubsub = new RedisPubSub({
    publisher: new Redis(REDIS_OPTIONS),
    subscriber: new Redis(REDIS_OPTIONS)
});
*/

const typeDefs = gql`
    type User {
        id: Int!
        username: String!
        email: String!
        events: [Event!]
        createdDate: String
        updatedDate: String
    }

    input CreateUserInput {
        username: String!
        email: String!
    }

    input UpdateUserInput {
        username: String
        email: String
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
        createdDate: String
        updatedDate: String
    }

    input CreateEventInput {
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: Int!
        user_id: Int!
    }

    input UpdateEventInput {
        title: String
        desc: String
        date: String
        from: String
        to: String
        location_id: Int
        user_id: Int
    }
    
    type Location {
        id: Int!
        name: String
        desc: String
        lat: Float
        lng: Float
        createdDate: String
        updatedDate: String
    }

    input CreateLocationInput {
        name: String!
        desc: String!
        lat: Float!
        lng: Float!
    }

    input UpdateLocationInput {
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
        createdDate: String
        updatedDate: String
    }

    input CreateParticipantInput {
        user_id: Int!
        event_id: Int!
    }

    input UpdateParticipantInput {
        user_id: Int
        event_id: Int
    }

    type Query {
        users: [User]
        user(id: Int!): User

        events: [Event]
        event(id: Int!): Event

        locations: [Location]
        location(id: Int!): Location

        participants: [Participant]
        participant(id: Int!): Participant
    }

    type Mutation {
        createUser(data: CreateUserInput!) : User
        updateUser(id: Int!, data: UpdateUserInput!) : User
        deleteUser(id: Int!) : User
        deleteAllUsers: Int

        createEvent(data: CreateEventInput!) : Event
        updateEvent(id: Int!, data: UpdateEventInput!) : Event
        deleteEvent(id: Int!) : Event
        deleteAllEvents: Int

        createLocation(data: CreateLocationInput!) : Location
        updateLocation(id: Int!, data: UpdateLocationInput!) : Location
        deleteLocation(id: Int!) : Location
        deleteAllLocations: Int

        createParticipant(data: CreateParticipantInput!) : Participant
        updateParticipant(id: Int!, data: UpdateParticipantInput!) : Participant
        deleteParticipant(id: Int!) : Participant
        deleteAllParticipants: Int
    }

    type Subscription {
        userCreated: User!
        eventCreated: Event!
        participantAdded: Participant!
    }
`;

const resolvers = {
    Subscription: {
        userCreated: {
            subscribe: () => pubsub.asyncIterator("USER_CREATED")
        },
        eventCreated: {
            subscribe: () => pubsub.asyncIterator("EVENT_CREATED")
        },
        participantAdded: {
            subscribe: () => pubsub.asyncIterator("PARTICIPANT_ADDED")
        }
    },
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
    Mutation: {
        createUser: (_parent, { data }) => {
            data.id = users.length + 1
            data.createdDate = new Date().toUTCString(),
            data.updatedDate = null
            users.push(data);
            // Publish event
            pubsub.publish("USER_CREATED", { userCreated: data });
            return data;
        },
        updateUser: (_parent, { id, data }) => {
            const userIndex = users.findIndex(x => x.id === id);

            if(userIndex === -1){
                throw new Error("User not found!");
            }

            users[userIndex] = {
                ...users[userIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }

            return users[userIndex];
        },
        deleteUser: (_parent, { id }) => {
            const userIndex = users.findIndex(x => x.id === id);

            if(userIndex === -1){
                throw new Error("User not found!");
            }

            const user = users[userIndex];
            users.splice(userIndex, 1);
            return user;
        },
        deleteAllUsers: (_parent, _args) => {
            const length = users.length;
            users.splice(0, length);
            return length;
        },

        createEvent: (_parent, { data }) => {
            const user = users.find(x => x.id === data.user_id);
            const location = locations.find(x => x.id === data.location_id);
            if(!user){
                throw Error("user_id Not Found!")
            }
            if(!location){
                throw Error("location_id Not Found!")
            }
            data.id = (events.length + 1)
            data.createdDate = new Date().toUTCString();
            data.updatedDate = null;
            events.push(data);
            // Publish event
            pubsub.publish("EVENT_CREATED", { eventCreated: data });
            return data;
        },
        updateEvent: (_parent, { id, data }) => {
            const eventIndex = events.findIndex(x => x.id === id);

            if(eventIndex === -1){
                throw new Error("Event not found!");
            }

            events[eventIndex] = {
                ...events[eventIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }

            return events[eventIndex];
        },
        deleteEvent: (_parent, { id }) => {
            const eventIndex = events.findIndex(x => x.id === id);

            if(eventIndex === -1){
                throw new Error("Event not found!");
            }

            const event = events[eventIndex];
            events.splice(eventIndex, 1);
            return event;
        },
        deleteAllEvents: (_parent, _args) => {
            const length = events.length;
            events.splice(0, length);
            return length;
        },

        createLocation: (_parent, { data }) => {
            data.id = (locations.length + 1)
            data.createdDate = new Date().toUTCString();
            data.updatedDate = null;
            locations.push(data);
            return data;
        },
        updateLocation: (_parent, { id, data }) => {
            const locationIndex = locations.findIndex(x => x.id === id);

            if(locationIndex === -1){
                throw new Error("Location not found!");
            }

            locations[locationIndex] = {
                ...locations[locationIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }

            return locations[locationIndex];
        },
        deleteLocation: (_parent, { id }) => {
            const locationIndex = locations.findIndex(x => x.id === id);

            if(locationIndex === -1){
                throw new Error("Location not found!");
            }

            const location = locations[locationIndex];
            locations.splice(locationIndex, 1);
            return location;
        },
        deleteAllLocations: (_parent, _args) => {
            const length = locations.length;
            locations.splice(0, length);
            return length;
        },
        
        createParticipant: (_parent, { data }) => {
            const user = users.find(x => x.id === data.user_id);
            const event = events.find(x => x.id === data.event_id);
            if(!user){
                throw Error("user_id Not Found!")
            }
            if(!event){
                throw Error("event_id Not Found!")
            }
            data.id = (participants.length + 1)
            data.createdDate = new Date().toUTCString();
            data.updatedDate = null;
            participants.push(data);
            // Publish event
            pubsub.publish("PARTICIPANT_ADDED", { participantAdded: data });
            return data;
        },
        updateParticipant: (_parent, { id, data }) => {
            const participantIndex = participants.findIndex(x => x.id === id);

            if(participantIndex === -1){
                throw new Error("Participant not found!");
            }

            participants[participantIndex] = {
                ...participants[participantIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }

            return participants[participantIndex];
        },
        deleteParticipant: (_parent, { id }) => {
            const participantIndex = locations.findIndex(x => x.id === id);

            if(participantIndex === -1){
                throw new Error("Participant not found!");
            }

            const participant = participants[participantIndex];
            participants.splice(participantIndex, 1);
            return participant;
        },
        deleteAllParticipants: (_parent, _args) => {
            const length = participants.length;
            participants.splice(0, length);
            return length;
        },
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

setupServer(typeDefs, resolvers, 4000);