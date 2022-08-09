import { withFilter } from 'graphql-subscriptions';

module.exports = {
    Query: {
        participants: async (_, __, { db: { Participants } }) => await Participants.find(),
        participant: async (_, args, { db: { Participants } }) => await Participants.findById(args.id)
    },
    Mutation: {
        createParticipant: async (_, { data }, { pubsub, db: { Participants } }) => {
            var createdParticipant = await Participants.create(data);
            // Publish event
            pubsub.publish("PARTICIPANT_ADDED", { participantAdded: createdParticipant });
            return createdParticipant;
        },
        updateParticipant: async (_, { id, data }, { db: { Participants } }) => await Participants.findByIdAndUpdate(id, data, {new: true}),
        deleteParticipant: async (_, { id }, { db: { Participants } }) => await Participants.findByIdAndRemove(id),
        deleteAllParticipants: async (_, _args, { db: { Participants } }) => {
            var { _, deletedCount } = await Participants.deleteMany()
            return deletedCount;
        }
    },
    Subscription: {
        participantAdded: {
            subscribe: withFilter(
                (_, __, { pubsub }) => pubsub.asyncIterator("PARTICIPANT_ADDED"),
                (payload, variables) => {
                    return variables.event_id ? (variables.eventId === payload.participantAdded.eventId) : true
                }
            )
        }
    },
    Participant: {
        user: async (parent, __, { db: { Users } }) => await Users.findById(parent.userId),
        event: async (parent, __, { db: { Events } }) => await Events.findById(parent.eventId)
    }
}