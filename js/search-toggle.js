// Get buttons and search sections
const showIngredientsSearch = document.getElementById('showIngredientsSearch');
const showNutrientsSearch = document.getElementById('showNutrientsSearch');
const ingredientsSearch = document.getElementById('ingredientsSearch');
const nutrientsSearch = document.getElementById('nutrientsSearch');

// Set default view to show ingredients search on page load
ingredientsSearch.classList.remove('hidden'); // Show ingredients search
nutrientsSearch.classList.add('hidden'); // Hide nutrients search

// Event listener for "Search by Ingredients" button
showIngredientsSearch.addEventListener('click', () => {
    ingredientsSearch.classList.remove('hidden'); // Show ingredients search
    nutrientsSearch.classList.add('hidden'); // Hide nutrients search
});

// Event listener for "Search by Nutrients" button
showNutrientsSearch.addEventListener('click', () => {
    nutrientsSearch.classList.remove('hidden'); // Show nutrients search
    ingredientsSearch.classList.add('hidden'); // Hide ingredients search
});
