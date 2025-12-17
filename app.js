let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

// تحويل أي وصفة قديمة لتتناسب مع النظام الجديد
recipes = recipes.map(r => {
    if (r.category && typeof r.category === "string") r.category = [r.category];
    else if (!r.category) r.category = [];
    if (!r.image) r.image = null;
    if (!r.ingredients || !Array.isArray(r.ingredients)) r.ingredients = [];
    return r;
});

localStorage.setItem("recipes", JSON.stringify(recipes));

// دالة تفكيك المكونات بدقة
function parseIngredients(input) {
    input = input.replace(/[,،]/g, ' ');
    return input.split(/\s+/).map(i => i.trim()).filter(i => i.length > 0);
}

// تحديث اقتراحات المكونات التلقائية
function updateIngredientSuggestions() {
    const datalist = document.getElementById("ingredientsList");
    datalist.innerHTML = "";
    const ingredientsSet = new Set();
    recipes.forEach(r => r.ingredients.forEach(i => ingredientsSet.add(i)));
    ingredientsSet.forEach(i => {
        const option = document.createElement("option");
        option.value = i;
        datalist.appendChild(option);
    });
}

// إضافة وصفة جديدة
function addRecipe() {
    const name = document.getElementById("recipeName").value.trim();
    const ingredients = parseIngredients(document.getElementById("recipeIngredients").value);
    const category = Array.from(document.querySelectorAll('input[name="recipeCategory"]:checked'))
                          .map(c => c.value);

    if (!name || ingredients.length === 0 || category.length === 0) {
        alert("الرجاء إدخال اسم الوصفة والمكونات واختيار تصنيف واحد على الأقل");
        return;
    }

    const imageFile = document.getElementById("recipeImage").files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveRecipe(name, ingredients, category, e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveRecipe(name, ingredients, category, null);
    }
}

function saveRecipe(name, ingredients, category, imageData) {
    recipes.push({ name, ingredients, category, image: imageData });
    localStorage.setItem("recipes", JSON.stringify(recipes));
    updateIngredientSuggestions();

    alert("تمت إضافة الوصفة 👌");

    document.getElementById("recipeName").value = "";
    document.getElementById("recipeIngredients").value = "";
    document.querySelectorAll('input[name="recipeCategory"]:checked').forEach(c => c.checked = false);
    document.getElementById("recipeImage").value = "";
}

// اختيار وصفة عشوائية
function getRandomRecipe() {
    const selectedCategory = document.getElementById("filterCategory").value;
    const mustHave = document.getElementById("mustHave").value.trim().toLowerCase();
    const mustNotHave = document.getElementById("mustNotHave").value.trim().toLowerCase();

    let filtered = recipes;

    if (selectedCategory) filtered = filtered.filter(r => r.category.includes(selectedCategory));
    if (mustHave) filtered = filtered.filter(r => r.ingredients.some(i => i.toLowerCase() === mustHave));
    if (mustNotHave) filtered = filtered.filter(r => !r.ingredients.some(i => i.toLowerCase() === mustNotHave));

    if (filtered.length === 0) {
        document.getElementById("selectedRecipe").innerHTML = "لا توجد وصفة مطابقة 😢";
        return;
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];

    const recipeHTML = `${random.image ? `<img src="${random.image}" alt="صورة الوصفة" style="max-width:100%;border-radius:10px;margin-bottom:10px;">` : ''}
        <h3>${random.name}</h3>
        <p>المكونات: ${random.ingredients.join(", ")}</p>
        <p>التصنيفات: ${random.category.join(", ")}</p>`;

    document.getElementById("selectedRecipe").innerHTML = recipeHTML;
}

// حفظ اسم المستخدم والإيموجي والثيم
function saveUserSettings() {
    const userName = document.getElementById("userName").value.trim();
    const theme = document.getElementById("themeSelector").value;
    if(userName) localStorage.setItem("userName", userName);
    localStorage.setItem("theme", theme);
    applyUserSettings();
}

// تطبيق الإعدادات عند تحميل الصفحة
function applyUserSettings() {
    const storedName = localStorage.getItem("userName");
    if(storedName) {
        document.getElementById("welcomeTitle").innerText = storedName;
        document.getElementById("userName").value = storedName;
    }

    const theme = localStorage.getItem("theme") || "white";
    document.getElementById("themeSelector").value = theme;
    document.body.className = ""; // إزالة أي ثيم سابق
    document.body.classList.add(`theme-${theme}`);
}

// عند تحميل الصفحة
window.onload = () => {
    updateIngredientSuggestions();
    applyUserSettings();
};
