let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
let editRecipeId = null;

/* تجهيز الوصفات القديمة */
recipes = recipes.map(r => ({
    id: r.id || Date.now() + Math.random(),
    name: r.name,
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    category: Array.isArray(r.category) ? r.category : [r.category],
    image: null
}));
localStorage.setItem("recipes", JSON.stringify(recipes));

/* تفكيك المكونات */
function parseIngredients(text) {
    return text
        .replace(/[,،]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

/* اقتراحات تلقائية */
function updateIngredientSuggestions() {
    const list = document.getElementById("ingredientsList");
    list.innerHTML = "";
    [...new Set(recipes.flatMap(r => r.ingredients))].forEach(i => {
        const option = document.createElement("option");
        option.value = i;
        list.appendChild(option);
    });
}

/* إضافة / تعديل وصفة */
function addRecipe() {
    const name = recipeName.value.trim();
    const ingredients = parseIngredients(recipeIngredients.value);
    const category = [...document.querySelectorAll('input[name="recipeCategory"]:checked')]
        .map(c => c.value);

    if (!name || !ingredients.length || !category.length) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    if (editRecipeId) {
        const recipe = recipes.find(r => r.id === editRecipeId);
        recipe.name = name;
        recipe.ingredients = ingredients;
        recipe.category = category;
        editRecipeId = null;
        alert("تم تعديل الوصفة ✏️");
    } else {
        recipes.push({
            id: Date.now(),
            name,
            ingredients,
            category,
            image: null
        });
        alert("تمت إضافة الوصفة 👌");
    }

    localStorage.setItem("recipes", JSON.stringify(recipes));
    updateIngredientSuggestions();
    resetForm();
}

/* اختيار عشوائي */
function getRandomRecipe() {
    let filtered = [...recipes];
    const cat = filterCategory.value;
    const must = mustHave.value.toLowerCase();
    const not = mustNotHave.value.toLowerCase();

    if (cat) filtered = filtered.filter(r => r.category.includes(cat));
    if (must) filtered = filtered.filter(r =>
        r.ingredients.some(i => i.toLowerCase().includes(must))
    );
    if (not) filtered = filtered.filter(r =>
        !r.ingredients.some(i => i.toLowerCase().includes(not))
    );

    if (!filtered.length) {
        selectedRecipe.innerHTML = "لا توجد وصفة مطابقة 😢";
        return;
    }

    const r = filtered[Math.floor(Math.random() * filtered.length)];
    selectedRecipe.innerHTML = `
        <h3>${r.name}</h3>
        <p>المكونات: ${r.ingredients.join(", ")}</p>
        <p>التصنيفات: ${r.category.join(", ")}</p>
        <button onclick="editRecipe(${r.id})">✏️ تعديل</button>
        <button onclick="deleteRecipe(${r.id})">🗑️ حذف</button>
    `;
}

/* تعديل */
function editRecipe(id) {
    const r = recipes.find(r => r.id === id);
    recipeName.value = r.name;
    recipeIngredients.value = r.ingredients.join(" ");
    document.querySelectorAll('input[name="recipeCategory"]').forEach(c =>
        c.checked = r.category.includes(c.value)
    );
    editRecipeId = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* حذف */
function deleteRecipe(id) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    recipes = recipes.filter(r => r.id !== id);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    updateIngredientSuggestions();
    selectedRecipe.innerHTML = "تم حذف الوصفة 🗑️";
}

/* إعادة تعيين */
function resetForm() {
    recipeName.value = "";
    recipeIngredients.value = "";
    document.querySelectorAll('input[name="recipeCategory"]').forEach(c => c.checked = false);
}

/* إعدادات المستخدم */
function saveUserSettings() {
    localStorage.setItem("userName", userName.value);
    localStorage.setItem("theme", themeSelector.value);
    applyUserSettings();
}

function applyUserSettings() {
    const name = localStorage.getItem("userName");
    const theme = localStorage.getItem("theme") || "white";
    if (name) welcomeTitle.innerText = name;
    document.body.className = `theme-${theme}`;
}

/* إيموجي متحرك */
const emojis = ["👨‍💻", "🔥", "🚀", "✨", "🧠"];
let emojiIndex = 0;
setInterval(() => {
    devEmoji.innerText = emojis[emojiIndex++ % emojis.length];
}, 2000);

window.onload = () => {
    applyUserSettings();
    updateIngredientSuggestions();
};
