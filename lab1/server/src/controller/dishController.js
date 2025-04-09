import {dishModel, DishesModel} from '../models/dishModel.js';






export const controller = {}


controller.getAllDishes = async (req, res) => {
  try {
    const dishes = await DishesModel.getAllDishes();
    
    if (dishes.length === 0) {
      return res.status(404).json({ 
        message: "No recipes found",
        suggestion: "Try adding recipes via POST /recipes"
      });
    }
    
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
}

controller.getDishById = async (req, res) => {
  try {
    const dish = await DishesModel.getDishById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ 
        message: "Recipe not found",
        availableIds: (await dishModel.find().distinct("_id")).sort() 
      });
    }
    
    res.json(dish);
  } catch (error) {
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
}

controller.addNewDish = async (req, res) => {
  try {
    const dish = req.body;
    const newDish = DishesModel.addNewDish(dish);
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ 
      message: "Validation failed",
      error: error.message 
    });
    }
}

controller.modifyDish = async (req, res) => {
  try {
    const updatedRecipe = await dishModel.findByIdAndUpdate(
      req.params.id,  // Just pass the ID directly
      { $set: req.body },
      { 
        new: true,         // Return the updated document
        runValidators: true // Run schema validators on update
      }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ 
      error: "Update failed",
      details: error.message 
    });
  }
}


controller.deleteDish = async (req, res) => {
  try {
    const result = await dishModel.findOneAndDelete({ id: req.params.id });
    
    if (!result) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    res.json({ 
      message: "Recipe deleted successfully",
      deletedRecipe: result 
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Deletion failed",
      details: error.message 
    });
  }
}