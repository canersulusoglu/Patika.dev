import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    title: { type: String, required: true},
    desc: { type: String, required: true},
    photo: {
        type: Buffer,
        required: true
    },
    mimetype: { type: String, required: true}
}, {
    timestamps: true
})

PhotoSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      const base64 = doc.photo.toString("base64");
      ret.data = `data:image${doc.mimetype};base64,${base64}`;
      return ret;
    },
});

export default mongoose.model("Photo", PhotoSchema)