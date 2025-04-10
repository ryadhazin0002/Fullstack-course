import {DishesModel} from '../models/dishModel.js';






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
        message: "Recipe not found" 
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
    res.status(201).json({
      message: "New Dish added",
      addedDish: newDish});
  } catch (error) {
    res.status(400).json({ 
      message: "Validation failed",
      error: error.message 
    });
    }
}

controller.modifyDish = async (req, res) => {
  const id = req.params.id;
  const dishBody = req.body;
  try{
    const currentDish = await DishesModel.getDishById(id)
    if (!currentDish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    const updatedDish = await DishesModel.updateDish(id, dishBody);
    res.json(updatedDish);
  } catch (error) {
    res.status(400).json({ 
      error: "Update failed",
      details: error.message 
    });
  }
}


controller.deleteDish = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await DishesModel.getDishById(id);
    if (!result) {
      return res.status(404).json({ message: "Dish not found" });
    }
    const deletedDish = DishesModel.deleteDish(id);
    res.json({ 
      message: "Dish deleted successfully",
      deletedDish: deletedDish
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Deletion failed",
      details: error.message 
    });
  }
}