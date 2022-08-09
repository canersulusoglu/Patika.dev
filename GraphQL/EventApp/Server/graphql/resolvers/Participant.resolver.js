import { withFilter } from 'graphql-subscriptions';

module.exports = {
    Query: {
        participants: (_, __, { db }) => db.participants,
        participant: (_parent, args, { db }) => db.participants.find(x => x.id === args.id)
    },
    Mutation: {
        createParticipant: (_parent, { data }, { db, pubsub }) => {
            const user = db.users.find(x => x.id === data.user_id);
            const event = db.events.find(x => x.id === data.event_id);
            if(!user){
                throw Error("user_id Not Found!")
            }
            if(!event){
                throw Error("event_id Not Found!")
            }
            data.id = (db.participants.length + 1)
            data.createdDate = new Date().toUTCString();
            data.updatedDate = null;
            db.participants.unshift(data);
            // Publish event
            pubsub.publish("PARTICIPANT_ADDED", { participantAdded: data });
            return data;
        },
        updateParticipant: (_parent, { id, data }, { db }) => {
            const participantIndex = db.participants.findIndex(x => x.id === id);
    
            if(participantIndex === -1){
                throw new Error("Participant not found!");
            }
    
            db.participants[participantIndex] = {
                ...db.participants[participantIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }
    
            return db.participants[participantIndex];
        },
        deleteParticipant: (_parent, { id }, { db }) => {
            const participantIndex = db.locations.findIndex(x => x.id === id);
    
            if(participantIndex === -1){
                throw new Error("Participant not found!");
            }
    
            const participant = db.participants[participantIndex];
            db.participants.splice(participantIndex, 1);
            return participant;
        },
        deleteAllParticipants: (_parent, _args, { db }) => {
            const length = db.participants.length;
            db.participants.splice(0, length);
            return length;
        }
    },
    Subscription: {
        participantAdded: {
            subscribe: withFilter(
                (_, __, { pubsub }) => pubsub.asyncIterator("PARTICIPANT_ADDED"),
                (payload, variables) => {
                    return variables.event_id ? (variables.event_id === payload.participantAdded.event_id) : true
                }
            )
        }
    },
    Participant: {
        user: async (parent, _args, { db }) => await db.users.find(x => x.id === parent.user_id),
        event: async (parent, _args, { db }) => await db.events.find(x => x.id === parent.event_id)
    }
}