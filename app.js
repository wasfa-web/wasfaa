let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

/* العنوان */
const appTitle = document.getElementById("appTitle");
const titleEditor = document.getElementById("titleEditor");

appTitle.innerText = localStorage.getItem("title") || "وصفاتك";

function saveTitle() {
  if (!titleEditor.value.trim()) return;
  localStorage.setItem("title", titleEditor.value);
  appTitle.innerText = titleEditor.value;
  titleEditor.value = "";
}

/* الثيم */
const themeSelector = document.getElementById("themeSelector");
const savedTheme = localStorage.getItem("theme") || "signature";
document.documentElement.setAttribute("data-theme", savedTheme);
themeSelector.value = savedTheme;

themeSelector.onchange = () => {
  document.documentElement.setAttribute("data-theme", themeSelector.value);
  localStorage.setItem("theme", themeSelector.value);
};

/* اقتراحات المكونات */
function updateIngredientSuggestions() {
  ingredientsList.innerHTML = "";
  [...new Set(recipes.flatMap(r => r.ingredients))].forEach(i => {
    const o = document.createElement("option");
    o.value = i;
    ingredientsList.appendChild(o);
  });
}

/* إضافة وصفة (الصورة اختيارية) */
function addRecipe() {
  const name = recipeName.value.trim();
  const ingredients = recipeIngredients.value
    .toLowerCase()
    .replace(/[,،]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const meal = mealType.value;
  if (!name || !ingredients.length || !meal) return;

  const recipe = {
    id: Date.now(),
    name,
    ingredients,
    meal,
    image: null
  };

  const file = recipeImage.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      recipe.image = reader.result;
      saveRecipe(recipe);
    };
    reader.readAsDataURL(file);
  } else {
    saveRecipe(recipe);
  }
}

function saveRecipe(recipe) {
  recipes.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  updateIngredientSuggestions();

  recipeName.value = "";
  recipeIngredients.value = "";
  recipeImage.value = "";
  mealType.value = "";
}

/* عشوائي + فلترة */
function getRandomRecipe() {
  let filtered = [...recipes];

  const must = mustHave.value.toLowerCase();
  const not = mustNotHave.value.toLowerCase();
  const meal = filterMeal.value;

  if (meal) filtered = filtered.filter(r => r.meal === meal);
  if (must) filtered = filtered.filter(r => r.ingredients.some(i => i.includes(must)));
  if (not) filtered = filtered.filter(r => !r.ingredients.some(i => i.includes(not)));

  if (!filtered.length) {
    selectedRecipe.innerText = "لا توجد وصفة مناسبة";
    return;
  }

  const r = filtered[Math.floor(Math.random() * filtered.length)];

  selectedRecipe.innerHTML = `
    <h3>${r.name} (${r.meal})</h3>
    ${r.image ? `<img src="${r.image}">` : ""}
    <p>${r.ingredients.join(", ")}</p>
    <button onclick="deleteRecipe(${r.id})">حذف</button>
  `;
}

function deleteRecipe(id) {
  recipes = recipes.filter(r => r.id !== id);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  selectedRecipe.innerText = "تم الحذف";
}

updateIngredientSuggestions();

/* Service Worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
