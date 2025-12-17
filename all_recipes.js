let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
const container = document.getElementById("recipesList");

function renderAllRecipes() {
  container.innerHTML = "";

  if (!recipes.length) {
    container.innerHTML = "<p>لا توجد وصفات</p>";
    return;
  }

  recipes.forEach((r, i) => {
    container.innerHTML += `
      <div class="card recipe-item">
        <h3>${r.name}</h3>
        <p>${r.ingredients.join(", ")}</p>
        ${r.image ? `<img src="${r.image}">` : ""}
        <div style="display:flex;gap:8px;">
          <button onclick="editRecipe(${i})">✏️ تعديل</button>
          <button onclick="deleteRecipe(${i})">🗑 حذف</button>
        </div>
      </div>
    `;
  });
}

function deleteRecipe(i) {
  if (!confirm("حذف الوصفة؟")) return;
  recipes.splice(i, 1);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  renderAllRecipes();
}

function editRecipe(i) {
  const name = prompt("اسم الوصفة", recipes[i].name);
  if (!name) return;
  const ing = prompt("المكونات", recipes[i].ingredients.join(" "));
  if (!ing) return;

  recipes[i].name = name;
  recipes[i].ingredients = ing.replace(/[,،]/g," ").split(/\s+/);

  localStorage.setItem("recipes", JSON.stringify(recipes));
  renderAllRecipes();
}

renderAllRecipes();
