module.exports = {
    Query: {
        users: async (_, __, { db: { Users } }) => await Users.find(),
        user: async (_, args, { db: { Users } }) => await Users.findById(args.id)
    },
    Mutation: {
        createUser: async (_, { data }, { pubsub, db: { Users } }) => {
            var createdUser = await Users.create(data)
            // Publish event
            pubsub.publish("USER_CREATED", { userCreated: createdUser });
            return createdUser;
        },
        updateUser: async (_, { id, data }, { db: { Users } }) => await Users.findByIdAndUpdate(id, data, {new: true}),
        deleteUser: async (_, { id }, { db: { Users } }) => await Users.findByIdAndRemove(id),
        deleteAllUsers: async (_, _args, { db: { Users } }) => {
            var { _, deletedCount } = await Users.deleteMany()
            return deletedCount;
        }
    },
    Subscription: {
        userCreated: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("USER_CREATED") 
        },
    },
    User: {
        events: async (parent, __, { db: { Events } }) => await Events.find({userId: parent.id})
    }
}