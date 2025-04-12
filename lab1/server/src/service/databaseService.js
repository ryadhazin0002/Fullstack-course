import mongoose from "mongoose";
import { config } from '../config/database.js';
const { Schema } = mongoose;
import 'dotenv/config';

// This is a service to connect to the database
const DatabaseService = {};



//Connect to the database function
DatabaseService.connect = () => {
    const connectionKey = config.mongoURI;
    console.log("connecting to database ...");
    try{
        mongoose.connect(connectionKey)
        .then(() => console.log("Connected successfully to MongoDB"))
        .catch(error => console.log("Error connecting to DB", error));
    }catch (error) {
        console.log("Error connecting to DB", error);
    }
}

// Dish schema definition
const dishSchema = new Schema({
    id: Number,
    name: String,
    ingredients: [String],  // Lowercase 'i' to match your insert
    preparationSteps: [String], // Corrected from preparedtonStops
    cookingTime: Number,
    origin: String,
    spiceLevel: String,
    difficulty: String    // For Swedish Meatballs
})

// Define the schema for the dishes collection
DatabaseService.dishModel = mongoose.model('dishes', dishSchema);

// Disconnect from the database function
DatabaseService.disconnect = () => {
    mongoose.disconnect()
    .then(() => console.log("Disconnected from MongoDB"))
    .catch(error => console.log("Error disconnecting from DB", error));
}

export default DatabaseService;
