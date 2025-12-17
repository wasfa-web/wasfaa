let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

const container = document.getElementById("recipesList");

function renderAllRecipes() {
  container.innerHTML = "";

  if (recipes.length === 0) {
    container.innerHTML = "<p>لا توجد وصفات</p>";
    return;
  }

  recipes.forEach((recipe, index) => {
    const card = document.createElement("div");
    card.className = "card recipe-item";

    card.innerHTML = `
      <h3>${recipe.name}</h3>
      <p>${recipe.ingredients.join(", ")}</p>
      ${recipe.image ? `<img src="${recipe.image}">` : ""}

      <div style="display:flex; gap:8px;">
        <button onclick="editRecipe(${index})">✏️ تعديل</button>
        <button onclick="deleteRecipe(${index})">🗑 حذف</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function deleteRecipe(index) {
  if (!confirm("هل أنت متأكد من حذف الوصفة؟")) return;

  recipes.splice(index, 1);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  renderAllRecipes();
}

function editRecipe(index) {
  const newName = prompt("اسم الوصفة", recipes[index].name);
  if (!newName) return;

  const newIngredients = prompt(
    "المكونات (مفصولة بمسافة أو فاصلة)",
    recipes[index].ingredients.join(" ")
  );
  if (!newIngredients) return;

  recipes[index].name = newName;
  recipes[index].ingredients = newIngredients
    .replace(/[,،]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  localStorage.setItem("recipes", JSON.stringify(recipes));
  renderAllRecipes();
}

renderAllRecipes();
