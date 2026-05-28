import mongoose from 'mongoose';
import dotenv from 'dotenv';

import dns from "node:dns/promises";   
dns.setServers(["1.1.1.1", "1.0.0.1"]);

dotenv.config()

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("conection success");
    } catch (error) {
        console.log(error);
    }
    
} 

export {connectDB}