import {dish} from '../models/dishModel.js';





export const controller = {}


controller.getAllDishes = async (req, res) => {
  try {
    const recipes = await dish.find();
    
    if (recipes.length === 0) {
      return res.status(404).json({ 
        message: "No recipes found",
        suggestion: "Try adding recipes via POST /recipes"
      });
    }
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
}

controller.getDishById = async (req, res) => {
  try {
    const recipe = await dish.findOne({ id: req.params.id });
    
    if (!recipe) {
      return res.status(404).json({ 
        message: "Recipe not found",
        availableIds: (await dish.find().distinct("id")).sort() 
      });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
}

controller.addNewDish = async (req, res) => {
  try {
    const newRecipe = new dish({
      id: req.body.id,
      name: req.body.name,
      ingredients: req.body.ingredients,
      preparationSteps: req.body.preparationSteps,
      cookingTime: req.body.cookingTime,
      origin: req.body.origin,
      spiceLevel: req.body.spiceLevel,
      difficulty: req.body.difficulty,
    });

    await newRecipe.save();;
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ 
      message: "Validation failed",
      error: error.message 
    });
    }
}

controller.modifyDish = async (req, res) => {
  try {
    const updatedRecipe = await dish.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
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
    const result = await dish.findOneAndDelete({ id: req.params.id });
    
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