let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

const appTitle = document.getElementById("appTitle");
const themeSelector = document.getElementById("themeSelector");
const mustHave = document.getElementById("mustHave");
const mustNotHave = document.getElementById("mustNotHave");
const selectedRecipe = document.getElementById("selectedRecipe");

// تحميل الاسم من localStorage عند فتح التطبيق
appTitle.value = localStorage.getItem("appTitle") || "🧑‍🍳 وصفاتك";
appTitle.addEventListener("input", () => {
  localStorage.setItem("appTitle", appTitle.value);
});

// تحميل الثيم من localStorage عند فتح الصفحة
const savedTheme = localStorage.getItem("theme") || "cyan";
document.body.setAttribute("data-theme", savedTheme);
themeSelector.value = savedTheme;

// تغيير الثيم عند اختيار المستخدم
themeSelector.addEventListener("change", () => {
  const theme = themeSelector.value;
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
});

// تحليل المكونات النصية إلى مصفوفة
function parseIngredients(text) {
  return text.replace(/[,،]/g, " ").split(/\s+/).filter(Boolean);
}

// تحديث قائمة اقتراحات المكونات
function updateIngredientSuggestions() {
  const list = document.getElementById("ingredientsList");
  list.innerHTML = "";
  [...new Set(recipes.flatMap(r => r.ingredients))].forEach(i => {
    const option = document.createElement("option");
    option.value = i;
    list.appendChild(option);
  });
}

// إضافة وصفة جديدة
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

// اقتراح تلقائي عند الكتابة في المربعين
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

// اختيار وصفة عشوائية
function getRandomRecipe() {
  let filtered = [...recipes];
  const must = mustHave.value.toLowerCase();
  const not = mustNotHave.value.toLowerCase();
  const mealFilter = filterMeal.value;

  if (must) filtered = filtered.filter(r => r.ingredients.some(i => i.toLowerCase().includes(must)));
  if (not) filtered = filtered.filter(r => !r.ingredients.some(i => i.toLowerCase().includes(not)));
  if (mealFilter) filtered = filtered.filter(r => r.meal === mealFilter);

  if (!filtered.length) {
    selectedRecipe.innerHTML = "<p>لا توجد وصفة</p>";
    return;
  }

  const r = filtered[Math.floor(Math.random() * filtered.length)];

  selectedRecipe.innerHTML = `
    <div class="recipe-box"><h2>${r.name}</h2></div>
    ${r.image ? `<img src="${r.image}" alt="${r.name}">` : ""}
    <div class="recipe-box"><p><strong>المكونات:</strong> ${r.ingredients.join(", ")}</p></div>
    <div class="recipe-box"><p><strong>نوع الوجبة:</strong> ${r.meal || "—"}</p></div>
  `;
}

// تفعيل الاقتراحات التلقائية عند الكتابة
mustHave.addEventListener("input", () => filterSuggestions(mustHave));
mustNotHave.addEventListener("input", () => filterSuggestions(mustNotHave));

// تحديث قائمة الاقتراحات عند تحميل الصفحة
updateIngredientSuggestions();
