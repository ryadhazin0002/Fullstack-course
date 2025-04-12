let recipes = []; // Initialize an empty array to store recipes


document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.createElement('button');
    addButton.textContent = 'Add New Dish';
    addButton.id = 'add-new-dish';
    addButton.classList.add('add-button');
    document.body.insertBefore(addButton, document.getElementById('recipe-container'));
    
    addButton.addEventListener('click', () => {
        showUpdateForm(null);
    });
});
// Function to load all dishes from the server
async function loadData() {
    const url = "http://localhost:5000/api/dishes";
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        recipes = data;
    } catch (error) {
        console.error("Error loading data:", error);
    }
}



// Function to delete a recipe
async function deleteRecipe(recipeId) {
    try {
        const response = await fetch(`http://localhost:5000/api/dishes/${recipeId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            recipes = recipes.filter(r => r._id !== recipeId);
            renderRecipes(recipes);
        } else {
            console.error('Failed to delete the recipe');
        }
    } catch (error) {
        console.error('Error deleting the recipe:', error);
    }
}

// Function to update a recipe
async function updateRecipe(recipeId, updatedRecipe) {
    try {
        const response = await fetch(`http://localhost:5000/api/dishes/${recipeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipe),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
}

// Function to add a new recipe
async function addNewRecipe(newRecipe) {
    try {
        const response = await fetch('http://localhost:5000/api/dishes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecipe),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding new recipe:', error);
        throw error;
    }
}

// Function to show the update form for adding or updating a recipe
function showUpdateForm(recipe) {
    const formContainer = document.createElement('div');
    formContainer.classList.add('update-form-container');
    
    const form = document.createElement('form');
    form.classList.add('update-form');
    
    const title = document.createElement('h2');
    title.textContent = recipe ? 'Update Recipe' : 'Add New Recipe';
    form.appendChild(title);
    
    const createEditableField = (label, value = '', isArray = false) => {
        const fieldContainer = document.createElement('div');
        fieldContainer.classList.add('form-field');
        
        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        
        let inputElement;
        if (isArray) {
            inputElement = document.createElement('textarea');
            inputElement.value = Array.isArray(value) ? value.join('\n') : '';
        } else {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = value || '';
        }
        
        if (!recipe) {
            inputElement.disabled = false;
        } else {
            inputElement.disabled = true;
        }
        
        inputElement.classList.add('form-input');
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.type = 'button';
        editButton.classList.add('edit-btn');
        
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.type = 'button';
        updateButton.classList.add('update-btn');
        updateButton.style.display = 'none';
        
        if (recipe) {
            editButton.addEventListener('click', () => {
                inputElement.disabled = false;
                inputElement.focus();
                editButton.style.display = 'none';
                updateButton.style.display = 'inline-block';
            });
            
            updateButton.addEventListener('click', () => {
                inputElement.disabled = true;
                updateButton.style.display = 'none';
                editButton.style.display = 'inline-block';
            });
        }
        
        fieldContainer.appendChild(labelElement);
        fieldContainer.appendChild(inputElement);
        
        if (recipe) {
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(updateButton);
            fieldContainer.appendChild(buttonContainer);
        }
        
        return fieldContainer;
    };
    
    form.appendChild(createEditableField('Name:', recipe?.name));
    form.appendChild(createEditableField('Ingredients:', recipe?.ingredients, true));
    form.appendChild(createEditableField('Preparation Steps:', recipe?.preparationSteps, true));
    form.appendChild(createEditableField('Cooking Time (minutes):', recipe?.cookingTime));
    form.appendChild(createEditableField('Origin:', recipe?.origin));
    form.appendChild(createEditableField('Spice Level:', recipe?.spiceLevel));
    form.appendChild(createEditableField('Difficulty:', recipe?.difficulty));
    
    const saveButton = document.createElement('button');
    saveButton.textContent = recipe ? 'Save Changes' : 'Add Dish';
    saveButton.type = 'button';
    saveButton.classList.add('save-btn');
    
    saveButton.addEventListener('click', async () => {
        const inputs = form.querySelectorAll('.form-input');
        const updatedRecipe = {
            name: inputs[0].value,
            ingredients: inputs[1].value.split('\n').filter(item => item.trim() !== ''),
            preparationSteps: inputs[2].value.split('\n').filter(item => item.trim() !== ''),
            cookingTime: inputs[3].value,
            origin: inputs[4].value,
            spiceLevel: inputs[5].value,
            difficulty: inputs[6].value
        };
        
        try {
            if (recipe) {
                await updateRecipe(recipe._id, updatedRecipe);
            } else {
                await addNewRecipe(updatedRecipe);
            }
            formContainer.remove();
            document.querySelector('.overlay').remove();
            await loadData();
            renderRecipes(recipes);
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    });
    
    form.appendChild(saveButton);
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.type = 'button';
    cancelButton.classList.add('cancel-btn');
    
    cancelButton.addEventListener('click', () => {
        formContainer.remove();
        document.querySelector('.overlay').remove();
    });
    
    form.appendChild(cancelButton);
    
    formContainer.appendChild(form);
    
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(formContainer);
    });
    
    document.body.appendChild(overlay);
    document.body.appendChild(formContainer);
}

// Function to render recipes on the page
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
                deleteRecipe(recipe._id);
            });
            
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.classList.add('update-button');
            updateButton.addEventListener('click', () => {
                showUpdateForm(recipe);
            });
            
            recipeDiv.appendChild(nameHeading);
            recipeDiv.appendChild(ingredientsHeading);
            recipeDiv.appendChild(ingredientsList);
            recipeDiv.appendChild(preparationHeading);
            recipeDiv.appendChild(preparationStepsList);
            recipeDiv.appendChild(cookingTimeParagraph);
            recipeDiv.appendChild(originParagraph);
            recipeDiv.appendChild(spiceLevelParagraph);
            recipeDiv.appendChild(difficultyParagraph);
            recipeDiv.appendChild(updateButton);
            recipeDiv.appendChild(deleteButton);
            
            recipesContainer.appendChild(recipeDiv);
        });
    } else {
        const noRecipesMessage = document.createElement('p');
        noRecipesMessage.textContent = 'No recipes available.';
        recipesContainer.appendChild(noRecipesMessage);
    }
}

// Load data and render recipes on page load
loadData().then(() => {
    renderRecipes(recipes);
}).catch(error => {
    console.error("Error loading data:", error);
});