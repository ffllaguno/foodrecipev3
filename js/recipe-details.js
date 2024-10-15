import { apiKey } from './api.js'; 

document.addEventListener("DOMContentLoaded", () => {
    const recipeId = new URLSearchParams(window.location.search).get('id');
    const addToListBtn = document.getElementById("addToListBtn");
    const goBackBtn = document.getElementById("goBackBtn");
    const notification = document.getElementById("notification");
    let currentRecipe; // Define currentRecipe here

    if (recipeId) {
        fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${recipeId}&includeNutrition=true&apiKey=${apiKey}`)
            .then(response => response.json())
            .then(recipes => {
                if (recipes && recipes.length > 0) {
                    currentRecipe = recipes[0]; // Assign the fetched recipe to currentRecipe
                    displayRecipe(currentRecipe);
                }
            })
            .catch(error => console.error("Error fetching recipe details:", error));
    }

    function displayRecipe(recipe) {
        document.getElementById("recipeImage").src = recipe.image;
        document.getElementById("recipeTitle").textContent = recipe.title;
        document.getElementById("recipeSummary").textContent = removeHTMLTags(recipe.summary);
        document.getElementById("recipeServings").textContent = recipe.servings;
        document.getElementById("recipePrepTime").textContent = recipe.readyInMinutes;
        document.getElementById("recipeIngredients").innerHTML = recipe.extendedIngredients.map(ingredient => `
            <li class="flex items-center mb-4 mt-4">
                <img src="https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}" alt="${ingredient.name}" class="w-12 h-12 mr-4 rounded-lg shadow-md object-cover">
                <span class="text-lg font-medium">${ingredient.original}</span>
            </li>
        `).join('');

        const selectedNutrients = ['Calories', 'Carbohydrates', 'Fat', 'Protein'];
        const nutritionHtml = recipe.nutrition.nutrients
            .filter(nutrient => selectedNutrients.includes(nutrient.name))
            .map(nutrient => `<p><strong>${nutrient.name}:</strong> ${nutrient.amount} ${nutrient.unit} (${nutrient.percentOfDailyNeeds.toFixed(2)}% of daily needs)</p>`)
            .join('');
        document.getElementById("nutritionContainer").innerHTML = nutritionHtml;

        const instructions = recipe.instructions;
        document.getElementById("recipeInstructions").textContent = removeHTMLTags(instructions);
    }

    goBackBtn.addEventListener("click", () => {
        window.history.back(); // Go back to the previous page
    });

    if (addToListBtn) {
        addToListBtn.addEventListener("click", () => {
            if (currentRecipe) {
                addToShoppingList(currentRecipe); // Use the currentRecipe variable
            }
        });
    }

    function removeHTMLTags(text) {
        return text.replace(/<\/?[^>]+(>|$)/g, '');
    }

    function addToShoppingList(recipe) {
        let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
        if (!shoppingList.some(item => item.title === recipe.title)) {
            shoppingList.push({
                title: recipe.title,
                ingredients: recipe.extendedIngredients.map(ingredient => ingredient.original)
            });
            localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
            showNotification("Ingredients added to shopping list!");
        } else {
            showNotification("Recipe is already in the shopping list!", "error");
        }
    }

    function showNotification(message, type = "success") {
        notification.textContent = message;
        notification.classList.remove("hidden");
        notification.classList.toggle("bg-green-500", type === "success");
        notification.classList.toggle("bg-red-600", type === "error");
        setTimeout(() => {
            notification.classList.add("hidden");
        }, 3000);
    }
});
