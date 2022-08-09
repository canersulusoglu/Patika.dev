module.exports = {
    Query: {
        locations: async (_, __, { db: { Locations } }) => await Locations.find(),
        location: async (_, args, { db: { Locations } }) => await Locations.findById(args.id),
    },
    Mutation: {
        createLocation: async (_, { data }, { db: { Locations } }) => await Locations.create(data),
        updateLocation: async (_, { id, data }, { db: { Locations } }) => await Locations.findByIdAndUpdate(id, data, {new: true}),
        deleteLocation: async (_, { id }, { db: { Locations } }) => await Locations.findByIdAndRemove(id),
        deleteAllLocations: async (_, __, { db: { Locations } }) => {
            var { _, deletedCount } = await Locations.deleteMany()
            return deletedCount;
        }
    }
}