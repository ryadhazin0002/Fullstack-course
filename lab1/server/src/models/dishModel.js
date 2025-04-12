import DatabaseService from "../service/databaseService.js";


//initialize the DishesModel
export const DishesModel = {}

//get all dishes
DishesModel.getAllDishes = async () => {
  try{
    const dishes = DatabaseService.dishModel.find();
    return dishes;
  }catch (error) {
    console.log(error);
    throw error; 
  }
}

//get dish by id
DishesModel.getDishById = async (dishId) => {
  try{
    const dish = DatabaseService.dishModel.findById(dishId);
    return dish;
  }catch (error) {
    console.log(error);
    throw error; 
  }

}
//get dish by name
DishesModel.getDishByName = async(name) => {
  try{
    const dish = DatabaseService.dishModel.findOne({"name": name});
    return dish;
  }
  catch (error) {
    console.log(error);
    throw error; 
  }
}
//add new dish
DishesModel.addNewDish = async (dish) => {
  try{
    const newDish = new DatabaseService.dishModel(dish);
    await newDish.save();
    return dish;
  }catch (error) {
    console.log(error);
    throw error; 
  }

}


//update dish
DishesModel.updateDish = async (id, body) => {
  try {
    const updatedDish = await DatabaseService.dishModel.findByIdAndUpdate(
      id,  
      { 
        $set: {
          id: body.id,
          name: body.name,
          ingredients: body.ingredients,
          preparationSteps: body.preparationSteps,
          cookingTime: body.cookingTime,
          origin: body.origin,
          spiceLevel: body.spiceLevel,
          difficulty: body.difficulty
        }
      },
      { 
        new: true,         // Return the updated document
        runValidators: true // Run schema validators
      }
    );
    return updatedDish;
  } catch(error) {
    console.log(error);
    throw error; 
  }
};

//delete dish
DishesModel.deleteDish = async (id) => {
  try{
    const result = await DishesModel.getDishById(id);
    if (!result) {
      console.log("Dish not found");
      return;
    }

    const deletedDish = await DatabaseService.dishModel.findByIdAndDelete(id);
    return deletedDish;
    
  }catch (error) {
    console.log(error);
    throw error; 
  }
}