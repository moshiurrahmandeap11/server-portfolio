import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
let client;
let db;

const uri = process.env.MONGO_URI;

const connectDB = async() => {
    try {
        if(!client) {
            client = new MongoClient(uri);
            await client.connect();
            db = client.db("moshiur_dev")
            console.log(("MongoDB Connected to moshiur dev"));
        }
        return db;
    } catch (error) {
        console.log("MongoDB connection failed : ", error.message);
        process.exit(1);
    }
}

export { connectDB, db };

