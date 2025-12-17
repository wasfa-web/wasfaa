if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// ---------------------------------------------
// قائمة الإيموجي لكل مكون
// ---------------------------------------------
const ingredientEmojis = {
  // فواكه
  "موز":"🍌","تفاح":"🍎","برتقال":"🍊","ليمون":"🍋","فراولة":"🍓",
  "عنب":"🍇","أناناس":"🍍","كيوي":"🥝","بطيخ":"🍉","كمثرى":"🍐",
  "خوخ":"🍑","مانجو":"🥭","كرز":"🍒","توت":"🫐","رمان":"🌹",
  "تين":"🍈","بابايا":"🥭","جوافة":"🍈","فاكهة التنين":"🐉","مشمش":"🥭",
  "ليمون أخضر":"🍋","جريب فروت":"🍊","بلح":"🌴","جوافة حمراء":"🍈","كرز أحمر":"🍒",
  "تين أخضر":"🍈","خوخ أصفر":"🍑","تفاح أخضر":"🍏","عنب أسود":"🍇","أناناس صغير":"🍍",
  "فراولة صغيرة":"🍓","رمان أحمر":"🌹","كيوي صغير":"🥝","مانجو أصفر":"🥭","موز صغير":"🍌",
  "بطيخ أحمر":"🍉","كمثرى صغيرة":"🍐","جوافة صغيرة":"🍈","توت بري":"🫐","بابايا صغيرة":"🥭",

  // خضار
  "طماطم":"🍅","خيار":"🥒","جزر":"🥕","فلفل أحمر":"🌶️","بصل":"🧅",
  "ثوم":"🧄","بطاطس":"🥔","قرنبيط":"🥦","سبانخ":"🥬","فطر":"🍄",
  "ذرة":"🌽","كرنب":"🥬","بطاطا حلوة":"🍠","كوسة":"🥒","بقدونس":"🌿",
  "نعناع":"🌱","خس":"🥬","فاصوليا":"🫘","بازيلا":"🟢","جرجير":"🥬",
  "فلفل أخضر":"🌶️","فلفل أصفر":"🌶️","باذنجان":"🍆","فجل":"🌶️","بروكلي":"🥦",
  "كرفس":"🥬","فاصوليا خضراء":"🟢","كراث":"🥬","شمندر":"🥕","يقطين":"🎃",

  // بروتينات
  "دجاج":"🍗","لحم بقر":"🥩","لحم غنم":"🐑","سمك":"🐟","جمبري":"🦐",
  "بيض":"🥚","جبن":"🧀","زبادي":"🍶","حليب":"🥛","توفو":"🍛",
  "عدس":"🥣","حمص":"🥣","فول":"🥣","نقانق":"🌭","لحم مقدد":"🥓",
  "سلمون":"🐟","تونة":"🐟","محار":"🦪","كابوريا":"🦀","محار صغير":"🦪",
  "روبيان":"🦐","كفتة":"🥩","برغر":"🍔","همبرغر":"🍔","سوشي":"🍣",

  // مشروبات
  "ماء":"💧","عصير برتقال":"🧃","عصير تفاح":"🧃","قهوة":"☕","شاي":"🍵",
  "حليب الشوكولاتة":"🥛🍫","مشروب غازي":"🥤","نبيذ":"🍷","بيرة":"🍺",
  "عصير طبيعي":"🧃","سموثي":"🍹","عصير ليمون":"🍋","عصير مانجو":"🥭",
  "كابتشينو":"☕","لاتيه":"☕","موهيتو":"🍸","كوكتيل":"🍹","شوكولاتة ساخنة":"🥛🍫",

  // مخبوزات وحبوب
  "خبز":"🍞","كرواسون":"🥐","بيتزا":"🍕","معكرونة":"🍝","أرز":"🍚",
  "كعك":"🍰","بان كيك":"🥞","دونات":"🍩","وافل":"🧇","توست":"🍞",
  "مقرمشات":"🍘","بسكويت":"🍪","كورن فليكس":"🥣","خبز أسمر":"🍞","خبز أبيض":"🍞",
  "فطائر":"🥮","رغيف":"🍞","كرامبل":"🍰","مافن":"🧁","تشيز كيك":"🍰",

  // حلويات
  "شوكولاتة":"🍫","مربى":"🍯","عسل":"🍯","كيك":"🍰","آيس كريم":"🍨",
  "بودينغ":"🍮","حلوى":"🍬","بسكويت":"🍪","جلي":"🍮","كراميل":"🍮",
  "موس":"🍮","تارت":"🍰","براوني":"🍫","براونيز":"🍫","كعك فواكه":"🍰",
  "بودينغ شوكولاتة":"🍮","حلوى جافة":"🍬","سويتس":"🍬","تشوكليت":"🍫","ميني كيك":"🧁",

  // مكسرات وزيوت
  "مكسرات":"🥜","لوز":"🥜","فستق":"🥜","جوز":"🥜","زيت الزيتون":"🫒",
  "زيت دوار الشمس":"🛢️","زبدة":"🧈","زيت نباتي":"🛢️","زيت جوز الهند":"🥥",

  // أطعمة جاهزة
  "سندويش":"🥪","تاكو":"🌮","فلافل":"🥙","شاورما":"🥙","هوت دوغ":"🌭",
  "بطاطس مقلية":"🍟","برغر":"🍔","همبرغر":"🍔","بيتزا صغيرة":"🍕","نودلز":"🍜",
  "رامن":"🍜","سوشي صغير":"🍣","سلطة":"🥗","شوربة":"🍲","كبسة":"🍛",
  "برياني":"🍛","طاجن":"🍲","مرق":"🍲","شوربة عدس":"🥣","سمبوسة":"🥟"
};

// ---------------------------------------------
// دالة لتحويل المكونات لإيموجي
// ---------------------------------------------
function addEmojisToIngredients(ingredients) {
  // نتأكد أن كل عنصر بدون فراغات ويحول للإيموجي إذا موجود
  return ingredients.map(i => ingredientEmojis[i.trim()] || i.trim()).join(", ");
}

// ---------------------------------------------
// تحميل الوصفات من localStorage
// ---------------------------------------------
let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

// ---------------------------------------------
// عناصر الصفحة
// ---------------------------------------------
const selectedRecipe = document.getElementById("selectedRecipe");
const mustHave = document.getElementById("mustHave");
const mustNotHave = document.getElementById("mustNotHave");
const filterMeal = document.getElementById("filterMeal");
const themeSelector = document.getElementById("themeSelector");

// ---------------------------------------------
// تحميل الثيم من localStorage
// ---------------------------------------------
const savedTheme = localStorage.getItem("theme") || "cyan";
document.body.setAttribute("data-theme", savedTheme);
if(themeSelector) themeSelector.value = savedTheme;

// تغيير الثيم عند اختيار المستخدم
if(themeSelector){
  themeSelector.addEventListener("change", () => {
    const theme = themeSelector.value;
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  });
}
function addRecipe() {
  const name = recipeName.value.trim();
  const ingredients = recipeIngredients.value.split(/[,،]\s*/).map(i => i.trim());
  const meal = mealType.value;
  const imageFile = recipeImage.files[0];

  if (!name || !ingredients.length) {
    alert("الرجاء إدخال اسم الوصفة والمكونات");
    return;
  }

  const saveRecipe = image => {
    recipes.push({
      name,
      ingredients, // مصفوفة نظيفة بدون فراغات
      meal,
      image: image || ""
    });

    localStorage.setItem("recipes", JSON.stringify(recipes));
    recipeName.value = "";
    recipeIngredients.value = "";
    recipeImage.value = "";
    updateIngredientSuggestions();
    alert("تمت إضافة الوصفة ✅");
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = () => saveRecipe(reader.result);
    reader.readAsDataURL(imageFile);
  } else {
    saveRecipe("");
  }
}


// ---------------------------------------------
// عرض وصفة عشوائية مع إيموجي
// ---------------------------------------------
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
    <div class="recipe-box"><p><strong>المكونات:</strong> ${addEmojisToIngredients(r.ingredients)}</p></div>
    <div class="recipe-box"><p><strong>نوع الوجبة:</strong> ${r.meal || "—"}</p></div>
  `;
}

// ---------------------------------------------
// الاقتراح التلقائي عند الكتابة
// ---------------------------------------------
mustHave?.addEventListener("input", () => filterSuggestions(mustHave));
mustNotHave?.addEventListener("input", () => filterSuggestions(mustNotHave));

function filterSuggestions(input) {
  const allIngredients = [...new Set(recipes.flatMap(r => r.ingredients))];
  const value = input.value.toLowerCase();
  const filtered = allIngredients.filter(i => i.toLowerCase().includes(value));

  if (!filtered.length && value.length) {
    input.setCustomValidity("لا يوجد مكون بهذا الاسم");
    input.reportValidity();
  } else input.setCustomValidity("");

  const list = document.getElementById(input.getAttribute("list"));
  list.innerHTML = "";
  filtered.forEach(i => {
    const option = document.createElement("option");
    option.value = i;
    list.appendChild(option);
  });
}

// ---------------------------------------------
// تحميل قائمة المكونات عند فتح الصفحة
// ---------------------------------------------
function updateIngredientSuggestions() {
  const list = document.getElementById("ingredientsList");
  if(!list) return;
  list.innerHTML = "";
  [...new Set(recipes.flatMap(r => r.ingredients))].forEach(i => {
    const option = document.createElement("option");
    option.value = i;
    list.appendChild(option);
  });
}
updateIngredientSuggestions();
