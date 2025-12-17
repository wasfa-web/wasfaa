let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

function parseIngredients(text) {
  return text.replace(/[,،]/g, " ").split(/\s+/).filter(Boolean);
}

function addRecipe() {
  const name = recipeName.value.trim();
  const ingredients = parseIngredients(recipeIngredients.value);
  const imageInput = document.getElementById("recipeImage");

  if (!name || !ingredients.length) return;

  if (imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => saveRecipe(reader.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveRecipe("");
  }

  function saveRecipe(img) {
    recipes.push({
      id: Date.now(),
      name,
      ingredients,
      image: img
    });

    localStorage.setItem("recipes", JSON.stringify(recipes));
    recipeName.value = "";
    recipeIngredients.value = "";
    recipeImage.value = "";
  }
}
