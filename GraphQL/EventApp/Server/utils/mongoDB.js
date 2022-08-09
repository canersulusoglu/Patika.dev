import { connect } from "mongoose";

export const connectMongoDB = () => {
    connect(process.env.MongoURI)
    .then(() => {
        console.info(`✅ MongoDB is connected.`);
    })
    .catch((err) => {
        console.error("❌ MongoDB is not connected. ", err.message);
    })
}