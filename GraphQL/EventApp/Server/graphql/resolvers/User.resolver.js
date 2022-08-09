module.exports = {
    Query: {
        users: (_, __, { db }) => db.users,
        user: (_parent, args, { db }) => db.users.find(x => x.id === args.id),
    },
    Mutation: {
        createUser: (_parent, { data }, { db, pubsub }) => {
            data.id = db.users.length + 1
            data.createdDate = new Date().toUTCString(),
            data.updatedDate = null
            db.users.unshift(data);
            // Publish event
            pubsub.publish("USER_CREATED", { userCreated: data });
            return data;
        },
        updateUser: (_parent, { id, data }, { db }) => {
            const userIndex = db.users.findIndex(x => x.id === id);
    
            if(userIndex === -1){
                throw new Error("User not found!");
            }
    
            db.users[userIndex] = {
                ...db.users[userIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }
    
            return db.users[userIndex];
        },
        deleteUser: (_parent, { id }, { db }) => {
            const userIndex = db.users.findIndex(x => x.id === id);
    
            if(userIndex === -1){
                throw new Error("User not found!");
            }
    
            const user = db.users[userIndex];
            db.users.splice(userIndex, 1);
            return user;
        },
        deleteAllUsers: (_parent, _args, { db }) => {
            const length = db.users.length;
            db.users.splice(0, length);
            return length;
        },
    },
    Subscription: {
        userCreated: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("USER_CREATED") 
        },
    },
    User: {
        events: (parent, _args, { db }) => db.events.filter(x => x.user_id === parent.id)
    }
}