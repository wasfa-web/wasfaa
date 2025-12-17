let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

function addRecipe() {
    const name = document.getElementById("recipeName").value.trim();
    const ingredients = document.getElementById("recipeIngredients").value.trim().split(",");
    const category = document.getElementById("recipeCategory").value;

    if (!name || ingredients.length === 0) {
        alert("الرجاء إدخال اسم الوصفة والمكونات");
        return;
    }

    recipes.push({ name, ingredients, category });
    localStorage.setItem("recipes", JSON.stringify(recipes));

    alert("تمت إضافة الوصفة 👌");

    document.getElementById("recipeName").value = "";
    document.getElementById("recipeIngredients").value = "";
}

function getRandomRecipe() {
    const selectedCategory = document.getElementById("filterCategory").value;
    const mustHave = document.getElementById("mustHave").value.trim();
    const mustNotHave = document.getElementById("mustNotHave").value.trim();

    let filtered = recipes;

    if (selectedCategory) {
        filtered = filtered.filter(r => r.category === selectedCategory);
    }

    if (mustHave) {
        filtered = filtered.filter(r => r.ingredients.some(i => i.includes(mustHave)));
    }

    if (mustNotHave) {
        filtered = filtered.filter(r => !r.ingredients.some(i => i.includes(mustNotHave)));
    }

    if (filtered.length === 0) {
        document.getElementById("selectedRecipe").innerText = "لا توجد وصفة مطابقة 😢";
        return;
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    document.getElementById("selectedRecipe").innerText =
        random.name + "\n\nالمكونات:\n" + random.ingredients.join(", ");
}

