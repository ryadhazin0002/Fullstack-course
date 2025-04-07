import mongoose from "mongoose";
import { connectToDatabase } from "../service/databaseService.js";
const { Schema } = mongoose;


connectToDatabase();

const dishSchema = new Schema({
  id: Number,
  name: String,
  ingredients: [String],  // Lowercase 'i' to match your insert
  preparationSteps: [String], // Corrected from preparedtonStops
  cookingTime: Number,
  origin: String,
  spiceLevel: String,
  difficulty: String,     // For Swedish Meatballs
})

export const dish = mongoose.model('dishes', dishSchema);