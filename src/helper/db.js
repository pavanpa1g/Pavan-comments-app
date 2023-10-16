import mongoose from "mongoose";

// import { User } from "@/models/user";

export const connectedDb = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "pavan_gram",
            maxPoolSize: 10
        });

        console.log("db connected...");

        console.log("connected with host", connection.host);
    } catch (error) {
        console.log("failed to connect db");
        console.log(error);
    }
};
