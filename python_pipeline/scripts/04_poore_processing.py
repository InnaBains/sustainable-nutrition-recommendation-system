\
import pandas as pd
from pathlib import Path

RAW = Path("data_raw")
OUT = Path("data_out")
OUT.mkdir(exist_ok=True)

POORE_XLS = RAW / "Poore & Nemecek (2018).xls"
SHEET = "Results - Retail Weight"
OUT_CSV = OUT / "stg_poore_product.csv"

def find_row_containing(raw: pd.DataFrame, text: str):
    mask = raw.astype(str).apply(lambda row: row.str.contains(text, case=False, na=False).any(), axis=1)
    idx = mask[mask].index
    return int(idx[0]) if len(idx) else None

def main():
    raw = pd.read_excel(POORE_XLS, sheet_name=SHEET, header=None)

    product_row = find_row_containing(raw, "Product")
    mean_row = find_row_containing(raw, "Mean")
    if product_row is None or mean_row is None:
        raise ValueError("Could not detect header rows. Try printing raw.head(40).")

    metric_header_row = product_row - 1
    sub_header_row = mean_row

    metric = raw.iloc[metric_header_row].fillna("").astype(str).tolist()
    sub = raw.iloc[sub_header_row].fillna("").astype(str).tolist()

    metric_ff = []
    current = ""
    for m in metric:
        m = (m or "").strip()
        if m and not m.lower().startswith("unnamed"):
            current = m
        metric_ff.append(current if current else "")

    colnames = []
    for m, s in zip(metric_ff, sub):
        s = (s or "").strip()
        if s.lower() == "product" or (m == "" and s):
            colnames.append("Product")
        elif m and s:
            colnames.append(f"{m} | {s}")
        elif m:
            colnames.append(m)
        else:
            colnames.append(s if s else "Unnamed")

    df = raw.iloc[sub_header_row + 1 :].copy()
    df.columns = colnames

    def find_mean_col(contains_text):
        candidates = [c for c in df.columns if ("| Mean" in c) and (contains_text.lower() in c.lower())]
        return sorted(candidates, key=len)[0] if candidates else None

    col_ghg = find_mean_col("GHG Emissions")
    col_land = find_mean_col("Land Use")
    col_fresh = find_mean_col("Freshwater Withdrawals")
    if None in (col_ghg, col_land, col_fresh):
        raise ValueError("Could not find required Mean columns. Print(df.columns) to inspect.")

    out = df[["Product", col_ghg, col_land, col_fresh]].copy()
    out = out.rename(columns={
        "Product": "poore_product",
        col_ghg: "ghg_kgco2_per_fu",
        col_land: "land_m2_per_fu",
        col_fresh: "freshwater_l_per_fu",
    })

    out["poore_product"] = out["poore_product"].astype(str).str.strip()
    out = out[out["poore_product"].ne("") & out["poore_product"].ne("nan")].copy()

    for c in ["ghg_kgco2_per_fu", "land_m2_per_fu", "freshwater_l_per_fu"]:
        out[c] = pd.to_numeric(out[c], errors="coerce")

    out["co2e_per_100g"] = out["ghg_kgco2_per_fu"] / 10.0
    out["land_use_m2_per_100g"] = out["land_m2_per_fu"] / 10.0
    out["water_use_l_per_100g"] = out["freshwater_l_per_fu"] / 10.0

    final = out[["poore_product", "co2e_per_100g", "land_use_m2_per_100g", "water_use_l_per_100g"]].copy()

    for c in ["co2e_per_100g", "land_use_m2_per_100g", "water_use_l_per_100g"]:
        final[c] = final[c].astype(float).round(4)

    final = final.dropna(subset=["co2e_per_100g", "land_use_m2_per_100g", "water_use_l_per_100g"], how="all")

    final.to_csv(OUT_CSV, index=False, encoding="utf-8")

    print("Wrote:", OUT_CSV, "rows:", len(final))

if __name__ == "__main__":
    main()
