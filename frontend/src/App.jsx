import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8080";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

const defaultFilters = {
  dietPreference: "Any",
  maxCo2: "Any",
  excludeIngredients: "",
  preferPantryReuse: true,
};

function co2Band(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || value == null) return "Unknown";
  if (n <= 0.4) return "Low";
  if (n <= 1.2) return "Medium";
  return "High";
}

function nutritionBand(kcal) {
  const n = Number(kcal ?? 0);
  if (!Number.isFinite(n) || kcal == null) return "Energy unknown";
  if (n <= 180) return "Lower energy";
  if (n <= 280) return "Moderate energy";
  return "Higher energy";
}

function pantryRisk(score) {
  const n = Number(score ?? 0);
  if (n >= 3) return { text: "urgent", cls: "bg-rose-50 text-rose-700 border-rose-200" };
  if (n >= 2) return { text: "near expiry", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { text: "fresh", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

function getDashboardTip({ urgentCount, nearExpiryCount, lowCo2Count, totalRecommendations }) {
  if (urgentCount >= 3) {
    return `You currently have ${urgentCount} urgent pantry items. Prioritising pantry reuse this week may help reduce household food waste.`;
  }
  if (nearExpiryCount >= 2) {
    return `You have ${nearExpiryCount} items close to expiry. Consider selecting recipes that reuse pantry ingredients first.`;
  }
  if (totalRecommendations > 0 && lowCo2Count < Math.ceil(totalRecommendations / 2)) {
    return "Your current recommendation mix includes several medium or high CO₂e meals. Consider selecting more low-impact meals next week.";
  }
  return "Your current recommendation mix appears relatively balanced for pantry reuse, sustainability and overall meal planning.";
}

function getPlanTip({ filteredCount, appliedFilters }) {
  if (filteredCount === 0) {
    return "No recipes matched the current filters. Try relaxing one or more settings to generate a fuller weekly plan.";
  }
  if (filteredCount < 10) {
    return `Only ${filteredCount} recipes matched the selected filters. A broader filter setting may improve weekly variety.`;
  }
  if (appliedFilters.preferPantryReuse && appliedFilters.maxCo2 === "Low") {
    return "This plan prioritises pantry reuse while also favouring low-CO₂e meals, supporting both waste reduction and sustainability goals.";
  }
  if (appliedFilters.preferPantryReuse) {
    return "This plan gives preference to pantry reuse, which can help reduce food waste and improve ingredient utilisation.";
  }
  return "This weekly plan balances recommendation quality with your selected nutrition and sustainability preferences.";
}

function App() {
  const [tab, setTab] = useState("dashboard");
  const [foods, setFoods] = useState([]);
  const [pantry, setPantry] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState({ foods: false, pantry: false, recs: false });
  const [errors, setErrors] = useState({ foods: "", pantry: "", recs: "" });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [limit, setLimit] = useState(100);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
const [recipeModalOpen, setRecipeModalOpen] = useState(false);
const [recipeLoading, setRecipeLoading] = useState(false);
const [recipeError, setRecipeError] = useState("");


  const [form, setForm] = useState({
    foodItemId: "",
    quantity: "",
    unit: "g",
    expiresOn: "",
  });

  const [filtersDraft, setFiltersDraft] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  function classifyMealType(recipe) {
  const name = (recipe.recipeName || "").toLowerCase();
  const kcal = Number(recipe.energyKcalPer100gRecipe || 0);
  const protein = Number(recipe.proteinGPer100gRecipe || 0);

  const breakfastKeywords = [
    "breakfast", "toast", "muffin", "pancake", "porridge", "oat",
    "granola", "yogurt", "smoothie", "croissant", "doughnut",
    "french toast", "scone", "omelette", "cinnamon roll"
  ];

  const sweetBakedKeywords = [
    "cake", "loaf", "bread", "roll", "churro", "fritter", "donut", "doughnut"
  ];

  const lunchKeywords = [
    "sandwich", "wrap", "salad", "soup", "tart", "slider", "bowl",
    "calamari", "fries", "rings"
  ];

  const dinnerKeywords = [
    "chicken", "curry", "pasta", "rice", "stew", "roast",
    "salmon", "casserole", "meatball", "noodle", "burger",
    "cutlet", "nugget"
  ];

  if (breakfastKeywords.some(k => name.includes(k))) return "Breakfast";
  if (dinnerKeywords.some(k => name.includes(k))) return "Dinner";
  if (lunchKeywords.some(k => name.includes(k))) return "Lunch";

  if (sweetBakedKeywords.some(k => name.includes(k))) return "Breakfast";

  if (protein >= 12) return "Dinner";
  if (kcal <= 220) return "Breakfast";
  if (kcal >= 320) return "Lunch";

  return "Lunch";
}
// --- Recipe Details Modal State Handling (App.jsx) ---
  async function openRecipeDetails(recipeId) {
  setRecipeLoading(true);
  setRecipeError("");
  setRecipeModalOpen(true);

  try {
    const res = await fetch(`${API_BASE}/api/recipes/${recipeId}`);
    if (!res.ok) throw new Error(`Recipe request failed: ${res.status}`);
    const data = await res.json();
    setSelectedRecipe(data);
  } catch (err) {
    setRecipeError(err.message);
    setSelectedRecipe(null);
  } finally {
    setRecipeLoading(false);
  }
}

function closeRecipeDetails() {
  setRecipeModalOpen(false);
  setSelectedRecipe(null);
  setRecipeError("");
}

  async function fetchFoods() {
    setLoading((s) => ({ ...s, foods: true }));
    setErrors((s) => ({ ...s, foods: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/foods`);
      if (!res.ok) throw new Error(`Foods request failed: ${res.status}`);
      setFoods(await res.json());
    } catch (err) {
      setErrors((s) => ({ ...s, foods: err.message }));
    } finally {
      setLoading((s) => ({ ...s, foods: false }));
    }
  }

  async function fetchPantry() {
    setLoading((s) => ({ ...s, pantry: true }));
    setErrors((s) => ({ ...s, pantry: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/pantry`);
      if (!res.ok) throw new Error(`Pantry request failed: ${res.status}`);
      setPantry(await res.json());
    } catch (err) {
      setErrors((s) => ({ ...s, pantry: err.message }));
    } finally {
      setLoading((s) => ({ ...s, pantry: false }));
    }
  }

  async function fetchRecommendations(currentLimit = limit) {
    setLoading((s) => ({ ...s, recs: true }));
    setErrors((s) => ({ ...s, recs: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/recommendations?limit=${currentLimit}`);
      if (!res.ok) throw new Error(`Recommendations request failed: ${res.status}`);
      setRecommendations(await res.json());
    } catch (err) {
      setErrors((s) => ({ ...s, recs: err.message }));
    } finally {
      setLoading((s) => ({ ...s, recs: false }));
    }
  }

  useEffect(() => {
    fetchFoods();
    fetchPantry();
    fetchRecommendations(100);
  }, []);

  const deduplicatedRecommendations = useMemo(() => {
  const bestByName = new Map();

  recommendations.forEach((item) => {
    const name = (item.recipeName || "").trim().toLowerCase();
    if (!name) return;

    const currentScore = Number(item.decisionScoreNutrition || item.decisionScore || 0);
    const existing = bestByName.get(name);

    if (!existing) {
      bestByName.set(name, item);
      return;
    }

    const existingScore = Number(existing.decisionScoreNutrition || existing.decisionScore || 0);
    if (currentScore > existingScore) {
      bestByName.set(name, item);
    }
  });

  return Array.from(bestByName.values()).sort((a, b) =>
    Number(b.decisionScoreNutrition || b.decisionScore || 0) -
    Number(a.decisionScoreNutrition || a.decisionScore || 0)
  );
}, [recommendations]);

const filteredRecommendations = useMemo(() => {
  let result = [...deduplicatedRecommendations];

  if (appliedFilters.maxCo2 !== "Any") {
    result = result.filter((r) => co2Band(r.co2eTotalKg) === appliedFilters.maxCo2);
  }

  if (appliedFilters.dietPreference === "High protein") {
  result = result.filter((r) => Number(r.proteinGPer100gRecipe || 0) >= 10);
}

if (appliedFilters.dietPreference === "Lower energy") {
  result = result.filter((r) => Number(r.energyKcalPer100gRecipe || 0) <= 220);
}

if (appliedFilters.dietPreference === "Balanced") {
  result = result.filter((r) => {
    const kcal = Number(r.energyKcalPer100gRecipe || 0);
    const protein = Number(r.proteinGPer100gRecipe || 0);
    return kcal > 180 && kcal <= 320 && protein >= 5;
  });
}

  if (appliedFilters.preferPantryReuse) {
    result = result.filter((r) => Number(r.pantryMatches || 0) > 0);
  }

 if (appliedFilters.excludeIngredients.trim()) {
  const excluded = appliedFilters.excludeIngredients
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

  result = result.filter((r) => {
    if (!r.ingredientNames || r.ingredientNames.length === 0) {
      return true;
    }

    const ingredients = r.ingredientNames.map((name) => name.toLowerCase());

    return !excluded.some((word) =>
      ingredients.some((ingredient) => ingredient.includes(word))
    );
  });
}

  return result;
}, [deduplicatedRecommendations, appliedFilters]);

  const generatedPlan = useMemo(() => {
  const source = filteredRecommendations;

  const grouped = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  };

  source.forEach((recipe) => {
    const type = classifyMealType(recipe);
    grouped[type].push(recipe);
  });

  const usedRecipeIds = new Set();

  function fillMealRow(mealType) {
    const row = [];

    for (let i = 0; i < DAYS.length; i++) {
      const chosen = grouped[mealType].find(
        (r) => !usedRecipeIds.has(r.recipeId)
      );

      if (chosen) {
        usedRecipeIds.add(chosen.recipeId);
        row.push(chosen);
      } else {
        row.push(null);
      }
    }

    return row;
  }

  const breakfastRow = fillMealRow("Breakfast");
  const lunchRow = fillMealRow("Lunch");
  const dinnerRow = fillMealRow("Dinner");

  return [...breakfastRow, ...lunchRow, ...dinnerRow];
}, [filteredRecommendations]);

const plannedMeals = generatedPlan.filter(Boolean).length;

  const nearExpiryCount = pantry.filter((p) => Number(p.wasteRiskScore || 0) >= 2).length;
  const urgentCount = pantry.filter((p) => Number(p.wasteRiskScore || 0) >= 3).length;

  const averageScore = deduplicatedRecommendations.length
    ? (
        deduplicatedRecommendations.reduce(
          (sum, item) => sum + Number(item.decisionScoreNutrition || item.decisionScore || 0),
          0
        ) / deduplicatedRecommendations.length
      ).toFixed(1)
    : "0.0";

  const lowCo2Count = deduplicatedRecommendations.filter(
    (r) => co2Band(r.co2eTotalKg) === "Low"
  ).length;

  const reuseCount = deduplicatedRecommendations.filter(
    (r) => Number(r.pantryMatches || 0) > 0
  ).length;

  const dashboardTip = getDashboardTip({
    urgentCount,
    nearExpiryCount,
    lowCo2Count,
    totalRecommendations: deduplicatedRecommendations.length,
  });

  const planTip = getPlanTip({
    filteredCount: filteredRecommendations.length,
    appliedFilters,
  });

  function openAddForm() {
  setEditingId(null);
  setForm({
    foodItemId: foods[0]?.id || "",
    quantity: "",
    unit: "g",
    expiresOn: "",
  });
  setShowForm(true);
}

  function openEditForm(item) {
    setEditingId(item.pantryItemId);
    setForm({
      foodItemId: item.foodItemId || "",
      quantity: item.quantity || "",
      unit: item.unit || "g",
      expiresOn: item.expiresOn || "",
    });
    setShowForm(true);
  }
// --- Pantry CRUD Logic (App.jsx) ---
  async function handleSavePantry(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
  foodItemId: Number(form.foodItemId),
  quantity: Number(form.quantity),
  unit: form.unit,
  expiresOn: form.expiresOn || null,
};

console.log("Submitting pantry payload:", payload);

    try {
      const res = await fetch(
        editingId ? `${API_BASE}/api/pantry/${editingId}` : `${API_BASE}/api/pantry`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Save failed: ${res.status}`);
      }

      setMessage(editingId ? "Pantry item updated successfully." : "Pantry item added successfully.");
      setShowForm(false);
      await fetchPantry();
      await fetchRecommendations(limit);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  async function handleDeletePantry(id) {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/pantry/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setMessage("Pantry item removed successfully.");
      await fetchPantry();
      await fetchRecommendations(limit);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  function applyPlanFilters() {
    setAppliedFilters(filtersDraft);
    setPlanGenerated(true);
    setTab("weekly");
  }

  function resetPlanFilters() {
    setFiltersDraft(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPlanGenerated(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Sustainable Meal Planner</h1>
            <p className="text-sm text-slate-500">
              Personalised nutrition, sustainability and household waste management for UK university students
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {[
              ["dashboard", "Dashboard / Home"],
              ["weekly", "Weekly Meal Plan"],
              ["pantry", "Pantry Management"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  tab === key
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
       
        {tab === "dashboard" && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Dashboard / Home</h2>
                  <p className="text-sm text-slate-500">
                    Summary of weekly planning, pantry expiry risks and sustainability impact
                  </p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Logged in: UK University Student
                </span>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              <Panel title="This Week’s Plan (summary)" subtitle="Mon–Sun • Breakfast / Lunch / Dinner">
                <div className="text-3xl font-bold">{plannedMeals} meals</div>
               <div className="mt-3 flex flex-wrap gap-2">
  <TinyPill text={`Low CO₂e: ${lowCo2Count}`} tone="green" />
  <TinyPill text={`Pantry reuse: ${reuseCount}`} tone="slate" />
</div>

<ul className="mt-4 space-y-2 text-sm text-slate-700">
  <li>
    Top recipe: <strong>{deduplicatedRecommendations[0]?.recipeName || "No result"}</strong>
  </li>
  <li>
    Near-expiry items used: <strong>{nearExpiryCount}</strong>
  </li>
  <li>
    Planned leftovers: <strong>{Math.max(1, Math.floor(reuseCount / 4))}</strong>
  </li>
</ul>
              </Panel>

              <Panel title="Pantry Overview (items close to expiry)" subtitle="Live pantry data from /api/pantry">
                {loading.pantry ? (
                  <p className="text-sm text-slate-500">Loading pantry…</p>
                ) : errors.pantry ? (
                  <p className="text-sm text-rose-600">{errors.pantry}</p>
                ) : (
                  <div className="space-y-3">
                    {pantry.slice(0, 4).map((item) => {
                      const risk = pantryRisk(item.wasteRiskScore);
                      return (
                        <div
                          key={item.pantryItemId}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3"
                        >
                          <div>
                            <div className="font-medium">{item.foodName}</div>
                            <div className="text-xs text-slate-500">{item.expiresOn || "No expiry date"}</div>
                          </div>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${risk.cls}`}>
                            {risk.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setTab("pantry")}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
                  >
                    Open Pantry
                  </button>
                  <span className="text-sm text-slate-500">{nearExpiryCount} items near expiry</span>
                </div>
              </Panel>

             <Panel title="Impact Summary (nutrition + CO₂e quick stats)" subtitle="Decision support overview">
  <div className="space-y-4 text-sm text-slate-700">
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3">
      <p className="text-sm text-sky-800">
        <strong>Assistant tip:</strong> {dashboardTip}
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      <TinyPill text={`Nutrition score: ${averageScore}`} tone="green" />
      <TinyPill
        text={`CO₂e: mostly ${
          lowCo2Count >= Math.ceil(deduplicatedRecommendations.length / 2) ? "Low" : "Mixed"
        }`}
        tone="blue"
      />
    </div>

    <div className="text-2xl font-bold">Low–Medium footprint</div>

    <ul className="space-y-2">
      <li>
        Average CO₂e band:{" "}
        <strong>
          {lowCo2Count >= Math.ceil(deduplicatedRecommendations.length / 2) ? "Low" : "Mixed"}
        </strong>
      </li>
      <li>
        Fruit/veg friendly recipes: <strong>{Math.max(4, lowCo2Count)}</strong>
      </li>
      <li>
        High pantry reuse recipes: <strong>{reuseCount}</strong>
      </li>
    </ul>
  </div>
</Panel>
            </div>

           
          </div>
        )}

        {tab === "weekly" && (
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Weekly meal plan</h2>
<p className="text-sm text-slate-500">Breakfast, lunch and dinner for the current week</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium">
                    Week: Mon–Sun (Current)
                  </span>
                  <button
                    onClick={applyPlanFilters}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Generate Plan
                  </button>
                  <button
  onClick={() => window.print()}
  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
>
  Export
</button>
                </div>
              </div>

              <section className="mb-4 rounded-3xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-sky-800">Assistant tip</h3>
                <p className="mt-1 text-sm text-sky-700">{planTip}</p>
              </section>

              {filteredRecommendations.length > 0 && filteredRecommendations.length < 21 && (
                <p className="mb-4 text-sm text-amber-700">
                  Only {filteredRecommendations.length} recipes matched the selected filters, so some weekly plan slots remain empty.
                </p>
              )}

              {filteredRecommendations.length === 0 && (
                <p className="mb-4 text-sm text-rose-700">
                  No recipes matched the selected filters. Try relaxing one or more filters.
                </p>
              )}

              

              {loading.recs ? (
                <p className="text-sm text-slate-500">Loading recommendation data…</p>
              ) : errors.recs ? (
                <p className="text-sm text-rose-600">{errors.recs}</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="border-b border-r border-slate-200 px-4 py-3 text-left font-semibold">
                          Meal
                        </th>
                        {DAYS.map((day) => (
                          <th
                            key={day}
                            className="border-b border-r border-slate-200 px-4 py-3 text-left font-semibold last:border-r-0"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MEALS.map((meal, mealIndex) => (
                        <tr key={meal}>
                          <td className="border-b border-r border-slate-200 bg-slate-50 px-4 py-3 font-semibold">
                            {meal}
                          </td>
                          {DAYS.map((day, dayIndex) => {
                            const item = generatedPlan[mealIndex * DAYS.length + dayIndex];
                            return (
                              <td
                                key={`${meal}-${day}`}
                                className="border-b border-r border-slate-200 px-3 py-3 align-top last:border-r-0"
                              >
                               {item ? (
  <div className="space-y-2">
    <div className="font-semibold leading-snug text-slate-900">{item.recipeName}</div>

    <div className="flex flex-wrap gap-1.5">
      <span
        className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
          co2Band(item.co2eTotalKg) === "Low"
            ? "border-sky-200 bg-sky-50 text-sky-700"
            : co2Band(item.co2eTotalKg) === "Medium"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-rose-200 bg-rose-50 text-rose-700"
        }`}
      >
        {co2Band(item.co2eTotalKg)} CO₂
      </span>
        
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
        {nutritionBand(item.energyKcalPer100gRecipe)}
      </span>

      

       <button
      onClick={() => openRecipeDetails(item.recipeId)}
      className="inline-flex items-center rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
    >
      Recipe details
    </button>
    </div>
  </div>
) : (
  <span className="text-slate-400">No recipe</span>
)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {planGenerated && (
                <p className="mt-4 text-sm text-slate-500">
                  Plan generated using the applied filters and recommendation results returned by the backend API.
                </p>
              )}
            </section>

            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold">Filters</h3>
              <p className="mb-4 text-sm text-slate-500">
                Refine the weekly plan using nutrition, sustainability and pantry priorities
              </p>

              <div className="space-y-4">
                <div>
  <label className="mb-1 block text-sm font-semibold">Nutrition preference</label>
  <p className="mb-2 text-xs text-slate-500">
    Select the nutritional focus for the weekly plan.
  </p>
  <select
    value={filtersDraft.dietPreference}
    onChange={(e) =>
      setFiltersDraft((s) => ({ ...s, dietPreference: e.target.value }))
    }
    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
  >
    <option>Any</option>
    <option>High protein</option>
    <option>Lower energy</option>
    <option>Balanced</option>
  </select>
</div>

                <div>
  <label className="mb-1 block text-sm font-semibold">Max CO₂e band</label>
  <p className="mb-2 text-xs text-slate-500">
    Limit recipes by estimated environmental impact.
  </p>
  <select
    value={filtersDraft.maxCo2}
    onChange={(e) =>
      setFiltersDraft((s) => ({ ...s, maxCo2: e.target.value }))
    }
    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
  >
    <option>Any</option>
    <option>Low</option>
    <option>Medium</option>
    <option>High</option>
  </select>
</div>

                <Field label="Exclude ingredients">
                  <input
                    type="text"
                    value={filtersDraft.excludeIngredients}
                    onChange={(e) =>
                      setFiltersDraft((s) => ({ ...s, excludeIngredients: e.target.value }))
                    }
                    placeholder="e.g. peanuts, milk, mushrooms"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </Field>

                <label className="flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 p-3">
                  <input
                    type="checkbox"
                    checked={filtersDraft.preferPantryReuse}
                    onChange={(e) =>
                      setFiltersDraft((s) => ({ ...s, preferPantryReuse: e.target.checked }))
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-semibold">Prefer pantry-matched recipes</div>
<div className="text-xs text-slate-500">
  Show recipes that reuse ingredients already present in the pantry.
</div>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={resetPlanFilters}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyPlanFilters}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {tab === "pantry" && (
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {message && (
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
    {message}
  </div>
)}
              <div>
                <h2 className="text-lg font-bold">Pantry Management View</h2>
                <p className="text-sm text-slate-500">
                  Manage food items, quantities, expiry dates and waste-risk status
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={openAddForm}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add item
                </button>
                <button
                  onClick={fetchPantry}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading.pantry ? (
              <p className="text-sm text-slate-500">Loading pantry…</p>
            ) : errors.pantry ? (
              <p className="text-sm text-rose-600">{errors.pantry}</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Food name</th>
                      <th className="px-4 py-3 font-semibold">Quantity</th>
                      <th className="px-4 py-3 font-semibold">Unit</th>
                      <th className="px-4 py-3 font-semibold">Expiry date</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pantry.map((item) => {
                      const risk = pantryRisk(item.wasteRiskScore);
                      return (
                        <tr key={item.pantryItemId} className="border-t border-slate-200">
                          <td className="px-4 py-3 font-medium">{item.foodName}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">{item.unit}</td>
                          <td className="px-4 py-3">{item.expiresOn || "Not set"}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${risk.cls}`}>
                              {risk.text}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditForm(item)}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePantry(item.pantryItemId)}
                                className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {showForm && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
                <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{editingId ? "Edit item" : "Add item"}</h3>
                      <p className="text-sm text-slate-500">Pantry item form overlay</p>
                    </div>
                    <button
                      onClick={() => setShowForm(false)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSavePantry} className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-semibold">Food (dropdown)</label>
                      <select
                        value={form.foodItemId}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, foodItemId: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select food item</option>
                        {foods.map((food) => (
                          <option key={food.id} value={food.id}>
                               {food.name}
                              </option>
                        ))}
                      </select>
                    </div>

                    <Field label="Quantity">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form.quantity}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, quantity: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        required
                      />
                    </Field>

                    <Field label="Unit">
                      <select
                        value={form.unit}
                        onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      >
                        {["g", "kg", "ml", "L", "pcs", "unit"].map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="md:col-span-2">
                      <Field label="Expiry date">
                        <input
                          type="date"
                          value={form.expiresOn}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, expiresOn: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {recipeModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      
      {/* Modal header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4">
        <div>
          <h3 className="text-xl font-bold">Recipe details</h3>
          <p className="text-sm text-slate-500">
            Ingredients, preparation steps and serving information
          </p>
        </div>

        <button
          onClick={closeRecipeDetails}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Close
        </button>
      </div>

      {/* Modal body */}
      <div className="overflow-y-auto px-6 py-5">
        {recipeLoading ? (
          <p className="text-sm text-slate-500">Loading recipe details…</p>
        ) : recipeError ? (
          <p className="text-sm text-rose-600">{recipeError}</p>
        ) : selectedRecipe ? (
          <div className="space-y-6">

            {/* Recipe header card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-2xl font-bold leading-tight">
                {selectedRecipe.recipeName}
              </h4>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  Servings: {selectedRecipe.servings ?? "Not specified"}
                </span>
              </div>

              {selectedRecipe.description && (
                <p className="mt-4 text-sm leading-6 text-slate-700">
                  {selectedRecipe.description}
                </p>
              )}
            </div>

            {/* Ingredients */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h5 className="mb-3 text-base font-bold">Ingredients</h5>

              {selectedRecipe.ingredients?.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      {ingredient.originalText || ingredient.foodName || "Unknown ingredient"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No ingredients available.</p>
              )}
            </div>

            {/* Instructions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h5 className="mb-3 text-base font-bold">Instructions</h5>
              <div className="whitespace-pre-line text-sm leading-6 text-slate-700">
                {selectedRecipe.instructions || "No instructions available."}
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold">{title}</h3>
      {subtitle && <p className="mb-4 text-sm text-slate-500">{subtitle}</p>}
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}

function TinyPill({ text, tone = "slate" }) {
  const cls =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "blue"
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{text}</span>;
}

export default App;