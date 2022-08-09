module.exports = {
    Query: {
        events: async (_, __, { db: { Events } }) => await Events.find(),
        eventCount: async (_, __, { db: { Events } }) => await Events.count(),
        eventsPagination: async (_, args, { db: { Events } }) => {
            var limit = args.itemPerPage;
            var offset = (args.pageNumber === 1) ? 0 : args.pageNumber * args.itemPerPage;
            return await Events.find().skip(offset).limit(limit);
        },
        event: async (_, args, { db: { Events } }) => await Events.findById(args.id)
    },
    Mutation: {
        createEvent: async (_, { data }, { pubsub, db: { Events } }) => {
            var createdEvent = await Events.create(data);
            var eventsCount = await Events.count();
            // Publish events
            pubsub.publish("EVENT_CREATED", { eventCreated: createdEvent });
            pubsub.publish("EVENT_COUNT", { eventCount: eventsCount });
            return createdEvent;
        },
        updateEvent: async (_, { id, data }, { db: { Events } }) => await Events.findByIdAndUpdate(id, data, {new: true}),
        deleteEvent: async (_, { id }, { db: { Events } }) => {
            var deletedEvent = await Events.findByIdAndRemove(id);
            var eventsCount = await Events.count();
            // Publish events
            pubsub.publish("EVENT_COUNT", { eventCount: eventsCount });
            return deletedEvent;
        },
        deleteAllEvents: async (_, _args, { db: { Events } }) => {
            var { _, deletedCount } = await Events.deleteMany()
            return deletedCount;
        }
    },
    Subscription: {
        eventCreated: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("EVENT_CREATED") 
        },
        eventCount: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("EVENT_COUNT")
        }
    },
    Event: {
        user: async (parent, __, { db: { Users } }) => await Users.findById(parent.userId),
        participants: async (parent, __, { db: { Participants } }) => await Participants.find({eventId: parent.id}),
        location: async (parent, __, { db: { Locations } }) => await Locations.findById(parent.locationId)
    }
}