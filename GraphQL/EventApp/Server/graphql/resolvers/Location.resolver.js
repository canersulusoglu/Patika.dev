export default {
    Query: {
        locations: (_, __, { db }) => db.locations,
        location: (_parent, args, { db }) => db.locations.find(x => x.id === args.id),
    },
    Mutation: {
        createLocation: (_parent, { data }, { db }) => {
            data.id = (db.locations.length + 1)
            data.createdDate = new Date().toUTCString();
            data.updatedDate = null;
            db.locations.push(data);
            return data;
        },
        updateLocation: (_parent, { id, data }, { db }) => {
            const locationIndex = db.locations.findIndex(x => x.id === id);
    
            if(locationIndex === -1){
                throw new Error("Location not found!");
            }
    
            db.locations[locationIndex] = {
                ...db.locations[locationIndex],
                ...data,
                updatedDate: new Date().toUTCString()
            }
    
            return db.locations[locationIndex];
        },
        deleteLocation: (_parent, { id }, { db }) => {
            const locationIndex = db.locations.findIndex(x => x.id === id);
    
            if(locationIndex === -1){
                throw new Error("Location not found!");
            }
    
            const location = db.locations[locationIndex];
            db.locations.splice(locationIndex, 1);
            return location;
        },
        deleteAllLocations: (_parent, _args, { db }) => {
            const length = db.locations.length;
            db.locations.splice(0, length);
            return length;
        },
    }
}