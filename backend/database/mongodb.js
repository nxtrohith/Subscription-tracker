import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from '../config/env.js'

if(!DB_URI){
    throw new Error("Database URI is not defined in .env.<development|production>.local file");
}

const connectToDatabase = async () => {
    try{
        console.log("Connecting to MongoDB database...");
        await mongoose.connect(DB_URI)
        console.log(`Connected to MongoDB database in ${NODE_ENV} mode.`);
    }catch(error){
        console.error("Error connecting to the database:", error);
    }
}

export default connectToDatabase;