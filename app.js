let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

function parseIngredients(text) {
    return text.replace(/[,،]/g, " ").split(/\s+/).filter(Boolean);
}

function updateIngredientSuggestions() {
    const list = document.getElementById("ingredientsList");
    list.innerHTML = "";
    [...new Set(recipes.flatMap(r => r.ingredients))].forEach(i => {
        const o = document.createElement("option");
        o.value = i;
        list.appendChild(o);
    });
}

function addRecipe() {
    const name = recipeName.value.trim();
    const ingredients = parseIngredients(recipeIngredients.value);
    const category = [...document.querySelectorAll('input[name="recipeCategory"]:checked')].map(c => c.value);

    if (!name || !ingredients.length) return;

    recipes.push({ id: Date.now(), name, ingredients, category });
    localStorage.setItem("recipes", JSON.stringify(recipes));
    updateIngredientSuggestions();
}

function getRandomRecipe() {
    let filtered = [...recipes];
    const must = mustHave.value.toLowerCase();
    const not = mustNotHave.value.toLowerCase();

    if (must) filtered = filtered.filter(r => r.ingredients.some(i => i.includes(must)));
    if (not) filtered = filtered.filter(r => !r.ingredients.some(i => i.includes(not)));

    if (!filtered.length) {
        selectedRecipe.innerText = "لا توجد وصفة";
        return;
    }

    const r = filtered[Math.floor(Math.random() * filtered.length)];
    selectedRecipe.innerText = `${r.name}\n${r.ingredients.join(", ")}`;
}

/* تسجيل Service Worker */
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}

/* إيموجي متغير */
const emojis = ["👨‍💻","🔥","🚀","✨"];
let i = 0;
setInterval(()=> devEmoji.innerText = emojis[i++ % emojis.length], 2000);

updateIngredientSuggestions();
