let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

/* العنوان */
const appTitle = document.getElementById("appTitle");
appTitle.innerText = localStorage.getItem("title") || "وصفاتك";
appTitle.oninput = () =>
  localStorage.setItem("title", appTitle.innerText);

/* الثيم */
const selector = document.getElementById("themeSelector");
const savedTheme = localStorage.getItem("theme") || "signature";
document.documentElement.setAttribute("data-theme", savedTheme);
selector.value = savedTheme;

selector.onchange = () => {
  document.documentElement.setAttribute("data-theme", selector.value);
  localStorage.setItem("theme", selector.value);
};

/* إضافة */
function addRecipe() {
  const name = recipeName.value.trim();
  const ingredients = recipeIngredients.value
    .toLowerCase()
    .replace(/[,،]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!name || !ingredients.length) return;

  const file = recipeImage.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    recipes.push({
      id: Date.now(),
      name,
      ingredients,
      image: reader.result
    });

    localStorage.setItem("recipes", JSON.stringify(recipes));
    recipeName.value = "";
    recipeIngredients.value = "";
    recipeImage.value = "";
  };

  if (file) reader.readAsDataURL(file);
}

/* عشوائي */
function getRandomRecipe() {
  if (!recipes.length) return;

  const r = recipes[Math.floor(Math.random() * recipes.length)];

  selectedRecipe.innerHTML = `
    <h3>${r.name}</h3>
    ${r.image ? `<img src="${r.image}">` : ""}
    <p>${r.ingredients.join(", ")}</p>
    <button onclick="editRecipe(${r.id})">تعديل</button>
    <button onclick="deleteRecipe(${r.id})">حذف</button>
  `;
}

/* حذف */
function deleteRecipe(id) {
  recipes = recipes.filter(r => r.id !== id);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  selectedRecipe.innerText = "تم الحذف";
}

/* تعديل */
function editRecipe(id) {
  const r = recipes.find(x => x.id === id);
  recipeName.value = r.name;
  recipeIngredients.value = r.ingredients.join(" ");
  deleteRecipe(id);
}

/* Service Worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
