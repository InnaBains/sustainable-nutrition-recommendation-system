\
import re
import numpy as np
import pandas as pd
from pathlib import Path

RAW = Path("data_raw")
OUT = Path("data_out")
OUT.mkdir(exist_ok=True)

COFID_XLSX = RAW / "cofid_2021.xlsx.xlsx"

COLS_OUT_FOOD = ["cofid_code", "name", "category", "base_unit"]
COLS_OUT_NUTR = ["cofid_code", "energy_kcal", "protein_g", "fat_g", "carbs_g", "fibre_g", "sugar_g", "salt_g"]

def to_float_cofid(x):
    if pd.isna(x):
        return np.nan
    s = str(x).strip()
    if s in {"", "-", "—", "N", "n", "NA", "N/A"}:
        return np.nan
    if s.lower() in {"tr", "trace"}:
        return 0.0
    if s.startswith("<"):
        s = s[1:].strip()
    s = re.sub(r"[^0-9.\-]", "", s)
    try:
        return float(s)
    except Exception:
        return np.nan

def main():
    prox = pd.read_excel(COFID_XLSX, sheet_name="1.3 Proximates")
    prox_sel = prox[[
        "Food Code", "Food Name", "Group",
        "Energy (kcal) (kcal)", "Protein (g)", "Fat (g)",
        "Carbohydrate (g)", "Total sugars (g)",
        "NSP (g)", "AOAC fibre (g)"
    ]].copy()

    prox_sel = prox_sel.dropna(subset=["Food Code"])
    prox_sel = prox_sel[~prox_sel["Food Code"].astype(str).str.contains("Food Code", case=False, na=False)]

    num_cols = [
        "Energy (kcal) (kcal)", "Protein (g)", "Fat (g)",
        "Carbohydrate (g)", "Total sugars (g)", "NSP (g)", "AOAC fibre (g)"
    ]
    for c in num_cols:
        prox_sel[c] = prox_sel[c].apply(to_float_cofid)

    prox_sel["fibre_g"] = prox_sel["AOAC fibre (g)"].combine_first(prox_sel["NSP (g)"])

    cofid_core = prox_sel.rename(columns={
        "Food Code": "cofid_code",
        "Food Name": "name",
        "Group": "category",
        "Energy (kcal) (kcal)": "energy_kcal",
        "Protein (g)": "protein_g",
        "Fat (g)": "fat_g",
        "Carbohydrate (g)": "carbs_g",
        "Total sugars (g)": "sugar_g",
    })[["cofid_code", "name", "category", "energy_kcal", "protein_g", "fat_g", "carbs_g", "sugar_g", "fibre_g"]].copy()

    inorg = pd.read_excel(COFID_XLSX, sheet_name="1.4 Inorganics")
    inorg2 = inorg.rename(columns={" ": "cofid_code"})[["cofid_code", "Sodium (mg)"]].copy()
    inorg2["sodium_mg"] = inorg2["Sodium (mg)"].apply(to_float_cofid)
    inorg2["salt_g"] = (inorg2["sodium_mg"] / 1000.0) * 2.5

    cofid_full = cofid_core.merge(inorg2[["cofid_code", "salt_g"]], on="cofid_code", how="left")

    fill_cols = ["energy_kcal","protein_g","fat_g","carbs_g","sugar_g","fibre_g","salt_g"]
    cofid_full["_filled"] = cofid_full[fill_cols].notna().sum(axis=1)
    cofid_dedup = (cofid_full
                   .sort_values(["cofid_code", "_filled"], ascending=[True, False])
                   .drop_duplicates(subset=["cofid_code"], keep="first")
                   .drop(columns=["_filled"]))

    stg_food_item = cofid_dedup[["cofid_code", "name", "category"]].copy()
    stg_food_item["base_unit"] = "g"
    stg_food_item = stg_food_item[COLS_OUT_FOOD]

    stg_nutrition = cofid_dedup[COLS_OUT_NUTR].copy()

    stg_food_item.to_csv(OUT / "stg_food_item.csv", index=False, encoding="utf-8")
    stg_nutrition.to_csv(OUT / "stg_nutrition.csv", index=False, encoding="utf-8")

    print("Wrote:", OUT / "stg_food_item.csv", "rows:", len(stg_food_item))
    print("Wrote:", OUT / "stg_nutrition.csv", "rows:", len(stg_nutrition))

if __name__ == "__main__":
    main()
