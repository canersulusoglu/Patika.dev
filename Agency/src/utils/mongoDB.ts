import { connect } from "mongoose";

export const connectMongoDB = async () => {   
    await connect(String(process.env.MONGODB_URI))
    .then(() => {
        console.info(`✅ MongoDB is connected.`);
    })
    .catch((err) => {
        console.error("❌ MongoDB is not connected. ", err.message);
    })
}