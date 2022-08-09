import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    name: { type: String, required: true},
    desc: { type: String, default: ''},
    lat: { type: Number, required: true},
    lng: { type: Number, required: true}
},{
    timestamps: true
})

export default mongoose.model("Location", LocationSchema);