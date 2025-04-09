import mongoose from "mongoose";
import { connectToDatabase } from "../service/databaseService.js";
const { Schema } = mongoose;


connectToDatabase();

const dishSchema = new Schema({
  _id: String,
  id: Number,
  name: String,
  ingredients: [String],  // Lowercase 'i' to match your insert
  preparationSteps: [String], // Corrected from preparedtonStops
  cookingTime: Number,
  origin: String,
  spiceLevel: String,
  difficulty: String,     // For Swedish Meatballs
})

export const dishModel = mongoose.model('dishes', dishSchema);


export const DishesModel = {}

DishesModel.getAllDishes = async () => {
  const dishes = dishModel.find();
  return dishes;
}


DishesModel.getDishById = async (dishId) => {
  
  const dish = dishModel.findById(dishId);
  return dish;
}

DishesModel.addNewDish = async (dish) => {
  const newDish = new dishModel(dish);
  await newDish.save();;
}
