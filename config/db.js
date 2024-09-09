import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected To MongoDb Database `);
    } catch (error) {
        console.log(`Error in MongoDb ${error}`);
    };
};
