let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

function parseIngredients(text) {
  return text.replace(/[,،]/g, " ").split(/\s+/).filter(Boolean);
}

function updateIngredientSuggestions() {
  const list = document.getElementById("ingredientsList");
  list.innerHTML = "";
  [...new Set(recipes.flatMap(r => r.ingredients))].forEach(i => {
    const option = document.createElement("option");
    option.value = i;
    list.appendChild(option);
  });
}

function addRecipe() {
  const name = recipeName.value.trim();
  const ingredients = parseIngredients(recipeIngredients.value);
  const imageInput = document.getElementById("recipeImage");
  const meal = document.getElementById("mealType").value;

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
      image: img,
      meal
    });
    localStorage.setItem("recipes", JSON.stringify(recipes));
    recipeName.value = "";
    recipeIngredients.value = "";
    imageInput.value = "";
    document.getElementById("mealType").value = "";
    updateIngredientSuggestions();
  }
}

function filterSuggestions(input) {
  const allIngredients = [...new Set(recipes.flatMap(r => r.ingredients))];
  const value = input.value.toLowerCase();
  const filtered = allIngredients.filter(i => i.toLowerCase().includes(value));

  if (!filtered.length && value.length) {
    input.setCustomValidity("لا يوجد مكون بهذا الاسم");
    input.reportValidity();
  } else {
    input.setCustomValidity("");
  }

  const list = document.getElementById(input.getAttribute("list"));
  list.innerHTML = "";
  filtered.forEach(i => {
    const option = document.createElement("option");
    option.value = i;
    list.appendChild(option);
  });
}

function getRandomRecipe() {
  let filtered = [...recipes];
  const must = mustHave.value.toLowerCase();
  const not = mustNotHave.value.toLowerCase();
  const meal = document.getElementById("filterMeal").value;

  if (must) filtered = filtered.filter(r => r.ingredients.some(i => i.toLowerCase().includes(must)));
  if (not) filtered = filtered.filter(r => !r.ingredients.some(i => i.toLowerCase().includes(not)));
  if (meal) filtered = filtered.filter(r => r.meal === meal);

  if (!filtered.length) {
    selectedRecipe.innerText = "لا توجد وصفة";
    return;
  }

  const r = filtered[Math.floor(Math.random() * filtered.length)];
  selectedRecipe.innerHTML = `${r.name}<br>${r.ingredients.join(", ")}<br>${r.meal}<br>${r.image ? `<img src="${r.image}">` : ""}`;
}

mustHave.addEventListener("input", () => filterSuggestions(mustHave));
mustNotHave.addEventListener("input", () => filterSuggestions(mustNotHave));

updateIngredientSuggestions();
