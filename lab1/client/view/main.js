let recipes = []; // Initialize an empty array to store recipes

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.createElement('button');
    addButton.textContent = 'Add New Dish';
    addButton.id = 'add-new-dish';
    addButton.classList.add('add-button');
    document.body.insertBefore(addButton, document.getElementById('recipe-container'));
    
    addButton.addEventListener('click', () => {
        showAddForm();
    });
    
    loadData();
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
        renderRecipes(recipes);
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
        
        const data = await response.json();
        return data;
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
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding new recipe:', error);
        throw error;
    }
}

// Function to show the add form
function showAddForm() {
    const formContainer = document.createElement('div');
    formContainer.classList.add('update-form-container');
    
    const form = document.createElement('form');
    form.classList.add('update-form');
    
    const title = document.createElement('h2');
    title.textContent = 'Add New Recipe';
    form.appendChild(title);
    
    const fields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'ingredients', label: 'Ingredients (one per line)', type: 'textarea' },
        { name: 'preparationSteps', label: 'Preparation Steps (one per line)', type: 'textarea' },
        { name: 'cookingTime', label: 'Cooking Time (minutes)', type: 'number' },
        { name: 'origin', label: 'Origin', type: 'text' },
        { name: 'spiceLevel', label: 'Spice Level', type: 'text' },
        { name: 'difficulty', label: 'Difficulty', type: 'text' }
    ];
    
    fields.forEach(field => {
        const fieldContainer = document.createElement('div');
        fieldContainer.classList.add('form-field');
        
        const labelElement = document.createElement('label');
        labelElement.textContent = field.label;
        
        let inputElement;
        if (field.type === 'textarea') {
            inputElement = document.createElement('textarea');
            inputElement.rows = 3;
        } else {
            inputElement = document.createElement('input');
            inputElement.type = field.type;
        }
        
        inputElement.name = field.name;
        inputElement.classList.add('form-input');
        
        fieldContainer.appendChild(labelElement);
        fieldContainer.appendChild(inputElement);
        form.appendChild(fieldContainer);
    });
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Add Dish';
    saveButton.type = 'button';
    saveButton.classList.add('save-btn');
    
    saveButton.addEventListener('click', async () => {
        const formData = new FormData(form);
        const newRecipe = {
            name: formData.get('name'),
            ingredients: formData.get('ingredients').split('\n').filter(item => item.trim() !== ''),
            preparationSteps: formData.get('preparationSteps').split('\n').filter(item => item.trim() !== ''),
            cookingTime: formData.get('cookingTime'),
            origin: formData.get('origin'),
            spiceLevel: formData.get('spiceLevel'),
            difficulty: formData.get('difficulty')
        };
        
        try {
            await addNewRecipe(newRecipe);
            formContainer.remove();
            document.querySelector('.overlay').remove();
            await loadData();
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

// Function to render recipes on the page in a table format with inline editing
function renderRecipes(recipes) {
    const recipesContainer = document.getElementById("recipe-container");
    recipesContainer.innerHTML = "";
    
    if (recipes && recipes.length > 0) {
        const table = document.createElement('table');
        table.classList.add('dishes-table');
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['Name', 'Ingredients', 'Preparation Steps', 'Cooking Time', 'Origin', 'Spice Level', 'Difficulty', 'Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        recipes.forEach(recipe => {
            const row = document.createElement('tr');
            row.dataset.id = recipe._id;
            
            // Create cells for each property
            const nameCell = createEditableCell(recipe.name, 'name');
            const ingredientsCell = createEditableCell(recipe.ingredients.join(', '), 'ingredients', true);
            const stepsCell = createEditableCell("- " + recipe.preparationSteps.join('\n- '), 'preparationSteps', true);
            const timeCell = createEditableCell(recipe.cookingTime, 'cookingTime');
            const originCell = createEditableCell(recipe.origin, 'origin');
            const spiceCell = createEditableCell(recipe.spiceLevel, 'spiceLevel');
            const difficultyCell = createEditableCell(recipe.difficulty, 'difficulty');
            
            // Actions cell with buttons
            const actionsCell = document.createElement('td');
            actionsCell.classList.add('actions-cell');
            
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.classList.add('save-button');
            saveButton.style.display = 'none';
            
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.classList.add('cancel-button');
            cancelButton.style.display = 'none';
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button');
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            
            // Add event listeners
            editButton.addEventListener('click', () => {
                enableRowEditing(row);
                editButton.style.display = 'none';
                deleteButton.style.display = 'none';
                saveButton.style.display = 'inline-block';
                cancelButton.style.display = 'inline-block';
            });
            
            cancelButton.addEventListener('click', () => {
                disableRowEditing(row);
                editButton.style.display = 'inline-block';
                deleteButton.style.display = 'inline-block';
                saveButton.style.display = 'none';
                cancelButton.style.display = 'none';
            });
            
            saveButton.addEventListener('click', async () => {
                const updatedRecipe = getUpdatedRecipeFromRow(row);
                try {
                    await updateRecipe(recipe._id, updatedRecipe);
                    disableRowEditing(row);
                    editButton.style.display = 'inline-block';
                    deleteButton.style.display = 'inline-block';
                    saveButton.style.display = 'none';
                    cancelButton.style.display = 'none';
                    // Update the display values
                    updateDisplayValues(row, updatedRecipe);
                } catch (error) {
                    console.error('Error updating recipe:', error);
                }
            });
            
            deleteButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this recipe?')) {
                    await deleteRecipe(recipe._id);
                }
            });
            
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(saveButton);
            actionsCell.appendChild(cancelButton);
            actionsCell.appendChild(deleteButton);
            
            // Append all cells to the row
            row.appendChild(nameCell);
            row.appendChild(ingredientsCell);
            row.appendChild(stepsCell);
            row.appendChild(timeCell);
            row.appendChild(originCell);
            row.appendChild(spiceCell);
            row.appendChild(difficultyCell);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        recipesContainer.appendChild(table);
    } else {
        const noRecipesMessage = document.createElement('p');
        noRecipesMessage.textContent = 'No recipes available.';
        recipesContainer.appendChild(noRecipesMessage);
    }
}

// Helper function to create editable cells
function createEditableCell(value, fieldName, isTextarea = false) {
    const cell = document.createElement('td');
    cell.dataset.field = fieldName;
    
    const displayDiv = document.createElement('div');
    displayDiv.classList.add('display-value');
    displayDiv.textContent = value;
    
    let inputElement;
    if (isTextarea) {
        inputElement = document.createElement('textarea');
        inputElement.value = value;
        inputElement.rows = 3;
    } else {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = value;
    }
    
    inputElement.classList.add('edit-input');
    inputElement.style.display = 'none';
    
    cell.appendChild(displayDiv);
    cell.appendChild(inputElement);
    
    return cell;
}

// Enable editing for a row
function enableRowEditing(row) {
    const cells = row.querySelectorAll('td:not(.actions-cell)');
    cells.forEach(cell => {
        const display = cell.querySelector('.display-value');
        const input = cell.querySelector('.edit-input');
        
        display.style.display = 'none';
        input.style.display = 'block';
    });
}

// Disable editing for a row
function disableRowEditing(row) {
    const cells = row.querySelectorAll('td:not(.actions-cell)');
    cells.forEach(cell => {
        const display = cell.querySelector('.display-value');
        const input = cell.querySelector('.edit-input');
        
        display.style.display = 'block';
        input.style.display = 'none';
    });
}

// Get updated recipe data from a row
function getUpdatedRecipeFromRow(row) {
    return {
        name: row.querySelector('[data-field="name"] .edit-input').value,
        ingredients: row.querySelector('[data-field="ingredients"] .edit-input').value.split('\n').filter(item => item.trim() !== ''),
        preparationSteps: row.querySelector('[data-field="preparationSteps"] .edit-input').value.split('\n').filter(item => item.trim() !== ''),
        cookingTime: row.querySelector('[data-field="cookingTime"] .edit-input').value,
        origin: row.querySelector('[data-field="origin"] .edit-input').value,
        spiceLevel: row.querySelector('[data-field="spiceLevel"] .edit-input').value,
        difficulty: row.querySelector('[data-field="difficulty"] .edit-input').value
    };
}

// Update display values after editing
function updateDisplayValues(row, updatedRecipe) {
    row.querySelector('[data-field="name"] .display-value').textContent = updatedRecipe.name;
    row.querySelector('[data-field="ingredients"] .display-value').textContent = updatedRecipe.ingredients.join('\n');
    row.querySelector('[data-field="preparationSteps"] .display-value').textContent = updatedRecipe.preparationSteps.join('\n');
    row.querySelector('[data-field="cookingTime"] .display-value').textContent = updatedRecipe.cookingTime;
    row.querySelector('[data-field="origin"] .display-value').textContent = updatedRecipe.origin;
    row.querySelector('[data-field="spiceLevel"] .display-value').textContent = updatedRecipe.spiceLevel;
    row.querySelector('[data-field="difficulty"] .display-value').textContent = updatedRecipe.difficulty;
}