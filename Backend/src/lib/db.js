import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected successfully: ${connect.connection.host}`);
    } catch (err) {
        console.log("MongoDB connection error:",err);
    }
};