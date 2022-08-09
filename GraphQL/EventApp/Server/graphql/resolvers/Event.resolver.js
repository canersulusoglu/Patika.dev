module.exports = {
    Query: {
        events: (_, __, { db }) => db.events,
        eventCount: (_, __, { db }) => db.events.length,
        eventsPagination: (_parent, args, { db }) => {
            var start = (args.pageNumber === 1) ? 0 : args.pageNumber * args.itemPerPage;
            var end = (args.pageNumber === 1) ? args.itemPerPage : (args.pageNumber + 1) * args.itemPerPage;
            return db.events.slice(start, end);
        },
        event: (_parent, args, { db }) => db.events.find(x => x.id === args.id),
    },
    Mutation: {
        createEvent: (_parent, { data }, { db, pubsub }) => {
            const user = db.users.find(x => x.id === data.user_id);
            const location = db.locations.find(x => x.id === data.location_id);
            if(!user){
                throw Error("user_id Not Found!")
            }
            if(!location){
                throw Error("location_id Not Found!")
            }
            data.id = (db.events.length + 1)
            data.createdDate = new Date().toUTCString();
            data.updatedDate = null;
            db.events.unshift(data);
            // Publish events
            pubsub.publish("EVENT_CREATED", { eventCreated: data });
            pubsub.publish("EVENT_COUNT", { eventCount: db.events.length });
            return data;
        },
        updateEvent: (_parent, { id, data }, { db }) => {
            const eventIndex = db.events.findIndex(x => x.id === id);
    
            if(eventIndex === -1){
                throw new Error("Event not found!");
            }
    
            db.events[eventIndex] = {
                ...db.events[eventIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }
    
            return db.events[eventIndex];
        },
        deleteEvent: (_parent, { id }, { db }) => {
            const eventIndex = db.events.findIndex(x => x.id === id);
    
            if(eventIndex === -1){
                throw new Error("Event not found!");
            }
    
            const event = db.events[eventIndex];
            db.events.splice(eventIndex, 1);
            // Publish events
            pubsub.publish("EVENT_COUNT", { eventCount: db.events.length });
            return event;
        },
        deleteAllEvents: (_parent, _args, { db }) => {
            const length = db.events.length;
            db.events.splice(0, length);
            return length;
        }
    },
    Subscription: {
        eventCreated: {
            subscribe: () => pubsub.asyncIterator("EVENT_CREATED")
        },
        eventCount: {
            subscribe: () => pubsub.asyncIterator("EVENT_COUNT")
        }
    },
    Event: {
        user: (parent, _args, { db }) => db.users.find(x => x.id === parent.user_id),
        participants: (parent, _args, { db }) => db.participants.filter(x => x.event_id === parent.id),
        location: (parent, _args, { db }) => db.locations.find(x => x.id === parent.location_id)
    }
}