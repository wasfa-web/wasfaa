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
    updateIngredientSuggestions();
  }
}

function filterSuggestions(input, isMustHave = true) {
  const allIngredients = [...new Set(recipes.flatMap(r => r.ingredients))];
  const value = input.value.toLowerCase();
  const filtered = allIngredients.filter(i => i.toLowerCase().includes(value));

  if (!filtered.length && value.length) {
    input.setCustomValidity("لا يوجد مكون بهذا الاسم");
    input.reportValidity();
  } else {
    input.setCustomValidity("");
  }

  const listId = input.getAttribute("list");
  const datalist = document.getElementById(listId);
  datalist.innerHTML = "";
  filtered.forEach(i => {
    const option = document.createElement("option");
    option.value = i;
    datalist.appendChild(option);
  });
}

function getRandomRecipe() {
  let filtered = [...recipes];
  const must = mustHave.value.toLowerCase();
  const not = mustNotHave.value.toLowerCase();

  if (must) filtered = filtered.filter(r => r.ingredients.some(i => i.toLowerCase().includes(must)));
  if (not) filtered = filtered.filter(r => !r.ingredients.some(i => i.toLowerCase().includes(not)));

  if (!filtered.length) {
    selectedRecipe.innerText = "لا توجد وصفة";
    return;
  }

  const r = filtered[Math.floor(Math.random() * filtered.length)];
  selectedRecipe.innerText = `${r.name}\n${r.ingredients.join(", ")}`;
}

/* تفعيل الاقتراحات الذكية */
mustHave.addEventListener("input", () => filterSuggestions(mustHave, true));
mustNotHave.addEventListener("input", () => filterSuggestions(mustNotHave, false));

updateIngredientSuggestions();
