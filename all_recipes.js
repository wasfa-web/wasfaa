// تطبيق الثيم المختار في الصفحة الأولى
document.body.setAttribute("data-theme", localStorage.getItem("theme") || "cyan");

const list = document.getElementById("allRecipes");
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

function render() {
  list.innerHTML = "";

  if (!recipes.length) {
    list.innerHTML = "<p>لا توجد وصفات</p>";
    return;
  }

  recipes.forEach((r, i) => {
    list.innerHTML += `
      <div class="card recipe-item">
        <h3>${r.name}</h3>
        <p><strong>المكونات:</strong> ${r.ingredients.join(", ")}</p>
        <p><strong>نوع الوجبة:</strong> ${r.meal}</p>
        ${r.image ? `<img src="${r.image}" alt="${r.name}">` : ""}

        <div style="display:flex; justify-content: space-between; margin-top:8px;">
          <button onclick="editRecipe(${i})">✏️ تعديل</button>
          <button onclick="deleteRecipe(${i})">🗑 حذف</button>
          <button onclick="shareRecipe(${i})">📤 مشاركة</button>
        </div>
      </div>
    `;
  });
}

function deleteRecipe(i) {
  if (!confirm("هل أنت متأكد من الحذف؟")) return;
  recipes.splice(i, 1);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  render();
}

function editRecipe(i) {
  const name = prompt("اسم الوصفة", recipes[i].name);
  if (!name) return;

  const ing = prompt("المكونات (افصل بينهم بفاصلة)", recipes[i].ingredients.join(", "));
  if (!ing) return;

  const meal = prompt("نوع الوجبة", recipes[i].meal);
  if (!meal) return;

  recipes[i].name = name;
  recipes[i].ingredients = ing.split(/[,،]\s*/);
  recipes[i].meal = meal;

  localStorage.setItem("recipes", JSON.stringify(recipes));
  render();
}

function shareRecipe(i) {
  const r = recipes[i];
  if (navigator.canShare && r.image) {
    fetch(r.image)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${r.name}.png`, { type: blob.type });
        navigator.share({
          title: r.name,
          text: `الوصفة: ${r.name}\nالمكونات: ${r.ingredients.join(", ")}\nنوع الوجبة: ${r.meal}`,
          files: [file]
        }).catch(console.error);
      });
  } else {
    const text = `الوصفة: ${r.name}\nالمكونات: ${r.ingredients.join(", ")}\nنوع الوجبة: ${r.meal}`;
    if (navigator.share) {
      navigator.share({ title: r.name, text }).catch(console.error);
    } else {
      prompt("انسخ هذه الوصفة وشاركها:", text);
    }
  }
}


render();
