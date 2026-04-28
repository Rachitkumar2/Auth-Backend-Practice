import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv()

async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Databse Connected")
    } catch (error) {
        console.log("Database is not Connected", error)
    }
}

export default connectDb