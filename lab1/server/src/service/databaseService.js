import mongoose from "mongoose";
import { config } from '../config/database.js';
import 'dotenv/config';



const connectionKey = config.mongoURI;

export function connectToDatabase(){
    mongoose.connect(connectionKey)
    .then(() => console.log("Connected successfully to MongoDB"))
    .catch(error => console.log("Error connecting to DB", error));
}
