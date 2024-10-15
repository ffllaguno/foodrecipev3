import { apiKey } from './api.js';
import {
    searchBtn, searchByNutrientsBtn, ingredientsInput, recipesContainer, paginationContainer, noRecipe, caloriesRange, caloriesValue,
    proteinRange, proteinValue, carbRange, carbValue, fatRange, fatValue
} from './dom-elements.js';

const resultsPerPage = 50; // Number of results to show per page

// Event listener for dynamically updating slider values
caloriesRange.addEventListener("input", () => {
    caloriesValue.textContent = caloriesRange.value;
});

proteinRange.addEventListener("input", () => {
    proteinValue.textContent = proteinRange.value;
});

carbRange.addEventListener("input", () => {
    carbValue.textContent = carbRange.value;
});

fatRange.addEventListener("input", () => {
    fatValue.textContent = fatRange.value;
});

// Detect if the page is refreshed
document.addEventListener("DOMContentLoaded", () => {
    if (performance.navigation.type === 1) {  // Type 1 means the page was refreshed
        sessionStorage.setItem('isReloaded', 'true');  // Mark it as a reload
    } else {
        sessionStorage.setItem('isReloaded', 'false'); // Mark it as normal navigation
    }

    const isReloaded = sessionStorage.getItem('isReloaded');

    // Clear localStorage if the page was refreshed
    if (isReloaded === 'true') {
        localStorage.removeItem('fetchedRecipes');
    }

    // Load previously fetched recipes from localStorage if not a refresh
    const fetchedRecipes = JSON.parse(localStorage.getItem('fetchedRecipes'));

    if (fetchedRecipes && fetchedRecipes.length > 0) {
        displayRecipes(fetchedRecipes);
    }
});

// Event listener for search by ingredients
searchBtn.addEventListener("click", () => {
    const ingredients = ingredientsInput.value.split(",").map(ingredient => ingredient.trim()).join(",");
    if (ingredients.length > 0) {
        fetchRecipesByIngredients(ingredients, 1);
    }
});

// Event listener for search by nutrients
searchByNutrientsBtn.addEventListener("click", () => {
    const calorieValue = document.getElementById("caloriesRange").value;
    const proteinValue = document.getElementById("proteinRange").value;
    const carbValue = document.getElementById("carbRange").value;
    const fatValue = document.getElementById("fatRange").value;

    const minCalories = Math.max(50, calorieValue - 50);
    const maxCalories = Math.min(800, Number(calorieValue) + 50);
    const minProtein = Math.max(10, proteinValue - 10);
    const maxProtein = Math.min(100, Number(proteinValue) + 10);
    const minCarbs = Math.max(10, carbValue - 10);
    const maxCarbs = Math.min(100, Number(carbValue) + 10);
    const minFat = Math.max(1, fatValue - 10);
    const maxFat = Math.min(100, Number(fatValue) + 10);

    fetchRecipesByNutrients({
        minCalories, maxCalories,
        minProtein, maxProtein,
        minCarbs, maxCarbs,
        minFat, maxFat
    }, 1);
});

// Fetch recipes by ingredients
function fetchRecipesByIngredients(ingredients, page = 1) {
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${resultsPerPage}&offset=${(page - 1) * resultsPerPage}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                displayNoRecipesMessage();
            } else {
                displayRecipes(data);
                localStorage.setItem('fetchedRecipes', JSON.stringify(data)); // Store fetched recipes in localStorage
                noRecipe.classList.add("hidden"); // Hide the no recipes message if results are found
            }
            updatePaginationControls(page);
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            displayNoRecipesMessage(); // Show message on error
        });
}

// Fetch recipes by nutrients
function fetchRecipesByNutrients(nutrients, page = 1) {
    const { minCalories, maxCalories, minProtein, maxProtein } = nutrients;
    fetch(`https://api.spoonacular.com/recipes/complexSearch?minCalories=${minCalories}&maxCalories=${maxCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&number=${resultsPerPage}&offset=${(page - 1) * resultsPerPage}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                displayNoRecipesMessage();
            } else {
                displayRecipes(data.results);
                localStorage.setItem('fetchedRecipes', JSON.stringify(data.results)); // Store fetched recipes in localStorage
                noRecipe.classList.add("hidden"); // Hide the no recipes message if results are found
            }
            updatePaginationControls(page);
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            displayNoRecipesMessage(); // Show message on error
        });
}

// Display recipes function
function displayRecipes(recipes) {
    recipesContainer.innerHTML = ""; // Clear previous recipes
    recipes.forEach(recipe => {
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("bg-white", "p-4", "shadow-lg", "rounded-lg", "cursor-pointer", "transition", "transform", "hover:shadow-xl", "hover:scale-105");

        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="rounded-lg w-full h-48 object-cover mb-4">
            <h2 class="text-lg font-bold text-gray-800">${recipe.title}</h2>
            <p class="text-gray-600 mt-2">Click for details!</p>
        `;
        recipeElement.addEventListener("click", () => {
            window.location.href = `recipe-details.html?id=${recipe.id}`;
        });
        recipesContainer.appendChild(recipeElement);
    });
}

// Function to show 'No Recipes Found' message
function displayNoRecipesMessage() {
    recipesContainer.innerHTML = ""; // Clear previous recipes
    noRecipe.classList.remove("hidden"); // Show the no recipes message
}

// Update pagination controls
function updatePaginationControls(currentPage) {
    paginationContainer.innerHTML = ""; // Clear previous pagination buttons
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage + 1;

    if (prevPage) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.classList.add("px-4", "py-2", "bg-gray-600", "text-white", "rounded-lg", "hover:bg-gray-700", "transition", "duration-200");
        prevButton.addEventListener("click", () => {
            fetchRecipesByIngredients(ingredientsInput.value, prevPage); // Adjust for nutrients if needed
        });
        paginationContainer.appendChild(prevButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("px-4", "py-2", "bg-gray-600", "text-white", "rounded-lg", "hover:bg-gray-700", "transition", "duration-200");
    nextButton.addEventListener("click", () => {
        fetchRecipesByIngredients(ingredientsInput.value, nextPage); // Adjust for nutrients if needed
    });
    paginationContainer.appendChild(nextButton);
}
