import express from 'express';
import { controller } from '../controller/dishController.js';

// initialize express router
export const router = express.Router();

// CREATE - Add new recipe
router.post("/dishes", controller.addNewDish);

// READ - Get all recipes
router.get("/dishes", controller.getAllDishes);

// READ - Get single recipe
router.get("/dish/:id", controller.getDishById);

router.get("/dishes/:name", controller.getDishByName);

// UPDATE - Modify recipe
router.put("/dishes/:id", controller.modifyDish);

// DELETE - Remove recipe
router.delete("/dishes/:id", controller.deleteDish);