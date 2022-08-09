import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
    eventId: { type: Schema.Types.ObjectId, required: true, ref: 'Event'},
},{
    timestamps: true
})

export default mongoose.model("Participant", ParticipantSchema);