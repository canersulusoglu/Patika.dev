import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: { type: String, required: true},
    desc: { type: String, default: ''},
    date: { type: String, required: true},
    from: { type: String, required: true},
    to: { type: String, required: true},
    locationId: { type: Schema.Types.ObjectId, required: true, ref: 'Location'},
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
},{
    timestamps: true
})

export default mongoose.model("Event", EventSchema);