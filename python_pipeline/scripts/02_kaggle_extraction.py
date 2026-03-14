\
import ast
import re
import pandas as pd
from pathlib import Path

RAW = Path("data_raw")
OUT = Path("data_out")
OUT.mkdir(exist_ok=True)

KAGGLE_CSV = RAW / "1_Recipe_csv.csv"

COLS_RECIPE = [
    "ext_recipe_id", "title", "category", "subcategory",
    "description", "num_ingredients", "num_steps", "directions_text"
]
COLS_ING = [
    "ext_recipe_id", "ingredient_pos", "ingredient_text", "ingredient_text_norm"
]

def parse_list_cell(x):
    if pd.isna(x):
        return []
    s = str(x).strip()
    try:
        v = ast.literal_eval(s)
        return v if isinstance(v, list) else []
    except Exception:
        return []

def norm_text(s: str) -> str:
    s = str(s).lower().strip()
    s = re.sub(r"\s+", " ", s)
    return s

def main():
    df = pd.read_csv(KAGGLE_CSV)

    # Limit to 1000 recipes to match XAMPP/phpMyAdmin import constraints (and your DB)
    df = df.head(1000).copy()

    df = df.reset_index(drop=True)
    df["ext_recipe_id"] = df.index.astype(int) + 1  # 1..1000

    recipes = pd.DataFrame({
        "ext_recipe_id": df["ext_recipe_id"],
        "title": df["recipe_title"].astype(str).str.strip(),
        "category": df["category"].astype(str).str.strip(),
        "subcategory": df["subcategory"].astype(str).str.strip(),
        "description": df["description"].astype(str).str.strip(),
        "num_ingredients": pd.to_numeric(df["num_ingredients"], errors="coerce"),
        "num_steps": pd.to_numeric(df["num_steps"], errors="coerce"),
        "directions_text": df["directions"].apply(parse_list_cell).apply(
            lambda steps: "\n".join([str(s).strip() for s in steps if str(s).strip()])
        ),
    })[COLS_RECIPE]

    rows = []
    for _, r in df.iterrows():
        ext_id = int(r["ext_recipe_id"])
        ing_list = parse_list_cell(r["ingredients"])
        for pos, ing in enumerate(ing_list, start=1):
            txt = str(ing).strip()
            if not txt:
                continue
            rows.append({
                "ext_recipe_id": ext_id,
                "ingredient_pos": pos,
                "ingredient_text": txt,
                "ingredient_text_norm": norm_text(txt),
            })

    recipe_ings = pd.DataFrame(rows, columns=COLS_ING)

    recipes.to_csv(OUT / "stg_recipe_kaggle.csv", index=False, encoding="utf-8")
    recipe_ings.to_csv(OUT / "stg_recipe_ingredient_kaggle.csv", index=False, encoding="utf-8")

    print("Wrote:", OUT / "stg_recipe_kaggle.csv", "rows:", len(recipes))
    print("Wrote:", OUT / "stg_recipe_ingredient_kaggle.csv", "rows:", len(recipe_ings))

if __name__ == "__main__":
    main()
