let recipes = []



async function loadData() {
    const url = "http://localhost:5000/api/dishes";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        recipes = data;
    } catch (error) {
        console.error("Error loading data:", error);
}
    }

async function deleteRecipe(recipeId) {
  try {
    const response = await fetch(`http://localhost:5000/api/dishes/${recipeId}`, {
      
    method: 'DELETE',
    });
    if (response.ok) {
    recipes = recipes.filter(r => r._id !== recipeId);
    renderRecipes(recipes);
    } else {
      console.log(recipeId)
    console.error('Failed to delete the recipe');
    }
  } catch (error) {
    console.error('Error deleting the recipe:', error);
  }
}



function renderRecipes(recipes) {
    const recipesContainer = document.getElementById("recipe-container");
    recipesContainer.innerHTML = ""; 

    
    

    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {

          
          const recipeDiv = document.createElement('div');
          recipeDiv.classList.add('recipe-card'); 

          const nameHeading = document.createElement('h2');
          nameHeading.textContent = recipe.name;
    
          const ingredientsList = document.createElement('ul');
          const ingredientsHeading = document.createElement('h3');
          ingredientsHeading.textContent = 'Ingredients:';
          recipe.ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;
            ingredientsList.appendChild(listItem);
          });
    
          const preparationStepsList = document.createElement('ol');
          const preparationHeading = document.createElement('h3');
          preparationHeading.textContent = 'Preparation Steps:';
          recipe.preparationSteps.forEach(step => {
            const listItem = document.createElement('li');
            listItem.textContent = step;
            preparationStepsList.appendChild(listItem);
          });
    
          const cookingTimeParagraph = document.createElement('p');
          cookingTimeParagraph.textContent = `Cooking Time: ${recipe.cookingTime} minutes`;
    
          const originParagraph = document.createElement('p');
          originParagraph.textContent = `Origin: ${recipe.origin}`;
    
          const spiceLevelParagraph = document.createElement('p');
          spiceLevelParagraph.textContent = `Spice Level: ${recipe.spiceLevel}`;
    
          const difficultyParagraph = document.createElement('p');
          difficultyParagraph.textContent = `Difficulty: ${recipe.difficulty}`;



            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', async () => {
              deleteRecipe(recipe._id)
            });


  

            recipeDiv.appendChild(deleteButton);

          
          recipeDiv.appendChild(nameHeading);
          recipeDiv.appendChild(ingredientsHeading);
          recipeDiv.appendChild(ingredientsList);
          recipeDiv.appendChild(preparationHeading);
          recipeDiv.appendChild(preparationStepsList);
          recipeDiv.appendChild(cookingTimeParagraph);
          recipeDiv.appendChild(originParagraph);
          recipeDiv.appendChild(spiceLevelParagraph);
          recipeDiv.appendChild(difficultyParagraph);
    
          recipesContainer.appendChild(recipeDiv);
        });
      } else {
        const noRecipesMessage = document.createElement('p');
        noRecipesMessage.textContent = 'No recipes available.';
        recipesContainer.appendChild(noRecipesMessage);
      }
    }



loadData().then(() => {
    renderRecipes(recipes);
}).catch(error => {
    console.error("Error loading data:", error);
});