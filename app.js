let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

// تحديث قائمة الاقتراحات تلقائيًا
function updateIngredientSuggestions() {
    const datalist = document.getElementById("ingredientsList");
    datalist.innerHTML = "";

    const ingredientsSet = new Set();
    recipes.forEach(r => r.ingredients.forEach(i => ingredientsSet.add(i)));

    ingredientsSet.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient;
        datalist.appendChild(option);
    });
}

function addRecipe() {
    const name = document.getElementById("recipeName").value.trim();
    const ingredients = document.getElementById("recipeIngredients").value
                        .trim().split(",").map(i => i.trim()).filter(i => i);
    
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
            const imageData = e.target.result;
            saveRecipe(name, ingredients, category, imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveRecipe(name, ingredients, category, null);
    }
}

function saveRecipe(name, ingredients, category, imageData) {
    recipes.push({ name, ingredients, category, image: imageData });
    localStorage.setItem("recipes", JSON.stringify(recipes));

    updateIngredientSuggestions(); // تحديث الاقتراحات بعد إضافة وصفة

    alert("تمت إضافة الوصفة 👌");

    document.getElementById("recipeName").value = "";
    document.getElementById("recipeIngredients").value = "";
    document.querySelectorAll('input[name="recipeCategory"]:checked').forEach(c => c.checked = false);
    document.getElementById("recipeImage").value = "";
}

function getRandomRecipe() {
    const selectedCategory = document.getElementById("filterCategory").value;
    const mustHave = document.getElementById("mustHave").value.trim().toLowerCase();
    const mustNotHave = document.getElementById("mustNotHave").value.trim().toLowerCase();

    let filtered = recipes;

    if (selectedCategory) {
        filtered = filtered.filter(r => r.category.includes(selectedCategory));
    }

    if (mustHave) {
        filtered = filtered.filter(r => r.ingredients.some(i => i.toLowerCase().includes(mustHave)));
    }

    if (mustNotHave) {
        filtered = filtered.filter(r => !r.ingredients.some(i => i.toLowerCase().includes(mustNotHave)));
    }

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

// عند تحميل الصفحة، تحديث الاقتراحات
window.onload = updateIngredientSuggestions;
