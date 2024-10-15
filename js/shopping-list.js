document.addEventListener("DOMContentLoaded", () => {
    const shoppingListContainer = document.getElementById("shoppingList");
    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    let recipeToDelete = null; // Variable to hold the recipe title to delete

    shoppingList.forEach(recipe => {
        const recipeElement = document.createElement("li");
        recipeElement.classList.add("mb-4", "p-4", "bg-white", "shadow-lg", "rounded-lg");

        const titleElement = document.createElement("h3");
        titleElement.textContent = recipe.title;
        titleElement.classList.add("text-xl", "font-bold", "mb-4");
        titleElement.style.listStyleType = "none"; // Ensure no bullet point for the title

        const ingredientsList = document.createElement("ul");
        ingredientsList.classList.add("list-none", "pl-0");

        recipe.ingredients.forEach((ingredient, index) => {
            const ingredientElement = document.createElement("li");
            ingredientElement.classList.add("flex", "items-center", "mb-2");

            // Create a label for each ingredient
            const label = document.createElement("label");
            label.classList.add("flex", "items-center", "ml-2");

            // Create a checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("mr-2");
            checkbox.checked = recipe.checkedIngredients && recipe.checkedIngredients[index]; // Set the checked state from localStorage
            checkbox.style.width = "20px"; // Increase the width of the checkbox
            checkbox.style.height = "20px"; // Increase the height of the checkbox            

            // Create the text node for the ingredient
            const ingredientText = document.createElement("span");
            ingredientText.textContent = ingredient;

            // Apply the gray text color if the ingredient is already checked
            if (checkbox.checked) {
                ingredientText.classList.add("text-gray-500", "line-through");
            }

            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    ingredientText.classList.add("text-gray-500", "line-through"); // Apply gray color when checked
                } else {
                    ingredientText.classList.remove("text-gray-500", "line-through"); // Remove gray color when unchecked
                }
                updateIngredientCheckState(recipe.title, index, checkbox.checked);
            });

            // Append the checkbox and ingredient text to the label
            label.appendChild(checkbox);
            label.appendChild(ingredientText);

            // Append label to ingredient element
            ingredientElement.appendChild(label);

            ingredientsList.appendChild(ingredientElement);
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("mt-2", "px-4", "py-2", "bg-red-600", "text-white", "rounded-lg", "hover:bg-red-700");

        // Show modal on button click
        removeBtn.addEventListener("click", () => {
            recipeToDelete = recipe.title; // Set the recipe title to delete
            document.getElementById("confirmationModal").classList.remove("hidden"); // Show the modal
        });

        recipeElement.appendChild(titleElement);
        recipeElement.appendChild(ingredientsList);
        recipeElement.appendChild(removeBtn);
        shoppingListContainer.appendChild(recipeElement);
    });

    // Modal button listeners
    document.getElementById("confirmDelete").addEventListener("click", () => {
        if (recipeToDelete) {
            removeFromShoppingList(recipeToDelete); // Remove the recipe
            document.getElementById("confirmationModal").classList.add("hidden"); // Hide the modal
            recipeToDelete = null; // Reset the variable
        }
    });

    document.getElementById("cancelDelete").addEventListener("click", () => {
        document.getElementById("confirmationModal").classList.add("hidden"); // Hide the modal
        recipeToDelete = null; // Reset the variable
    });
});

function updateIngredientCheckState(recipeTitle, ingredientIndex, isChecked) {
    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    const recipe = shoppingList.find(item => item.title === recipeTitle);
    if (!recipe.checkedIngredients) {
        recipe.checkedIngredients = [];
    }
    recipe.checkedIngredients[ingredientIndex] = isChecked;
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

function removeFromShoppingList(recipeTitle) {
    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    shoppingList = shoppingList.filter(item => item.title !== recipeTitle);
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    window.location.reload(); // Reload the page to reflect changes
}
