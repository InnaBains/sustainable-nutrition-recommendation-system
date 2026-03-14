\
import re
import pandas as pd
from pathlib import Path

OUT = Path("data_out")
IN_CSV = OUT / "stg_recipe_ingredient_kaggle.csv"
OUT_CSV = OUT / "stg_recipe_ingredient_parsed.csv"

UNIT_MAP = {
    "teaspoon":"tsp","teaspoons":"tsp","tsp":"tsp",
    "tablespoon":"tbsp","tablespoons":"tbsp","tbsp":"tbsp",
    "cup":"cup","cups":"cup",
    "ounce":"oz","ounces":"oz","oz":"oz",
    "pound":"lb","pounds":"lb","lb":"lb",
    "gram":"g","grams":"g","g":"g",
    "kilogram":"kg","kilograms":"kg","kg":"kg",
    "milliliter":"ml","milliliters":"ml","ml":"ml",
    "liter":"l","liters":"l","l":"l",
    "clove":"clove","cloves":"clove",
    "slice":"slice","slices":"slice",
    "piece":"piece","pieces":"piece",
}

def parse_quantity(q: str):
    if q is None:
        return None
    q = str(q).strip()
    m = re.match(r"^(\d+)\s+(\d+)\s*/\s*(\d+)$", q)
    if m:
        return float(m.group(1)) + float(m.group(2))/float(m.group(3))
    m = re.match(r"^(\d+)\s*/\s*(\d+)$", q)
    if m:
        return float(m.group(1))/float(m.group(2))
    try:
        return float(q)
    except Exception:
        return None

def parse_line(s: str):
    if pd.isna(s) or str(s).strip()=="":
        return None, None, None

    s = str(s).lower().strip()
    s = re.sub(r"\([^)]*\)", "", s)
    s = s.replace("¼","1/4").replace("½","1/2").replace("¾","3/4")
    s = re.sub(r"\s+", " ", s).strip()

    m = re.match(r"^(\d+\s+\d+/\d+|\d+/\d+|\d+(?:\.\d+)?)\s+(.*)$", s)
    qty = None
    rest = s
    if m:
        qty = parse_quantity(m.group(1))
        rest = m.group(2).strip()

    unit = None
    parts = rest.split()
    if parts:
        cand = re.sub(r"[^\w]", "", parts[0])
        if cand in UNIT_MAP:
            unit = UNIT_MAP[cand]
            rest = " ".join(parts[1:]).strip()

    rest = rest.strip(" ,.")
    rest = re.sub(r"\bto taste\b", "", rest).strip(" ,.")
    return qty, unit, rest if rest else None

def main():
    ings = pd.read_csv(IN_CSV)

    parsed = ings.copy()
    parsed[["quantity","unit","ingredient_core"]] = parsed["ingredient_text_norm"].apply(
        lambda x: pd.Series(parse_line(x))
    )

    out = parsed[["ext_recipe_id","ingredient_pos","ingredient_text_norm","quantity","unit","ingredient_core"]].copy()
    out.to_csv(OUT_CSV, index=False, encoding="utf-8")

    print("Wrote:", OUT_CSV, "rows:", len(out))
    print("Quantity parsed %:", round(out["quantity"].notna().mean()*100, 2))
    print("Unit parsed %:", round(out["unit"].notna().mean()*100, 2))

if __name__ == "__main__":
    main()
