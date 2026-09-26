"""Калькулятор КП v0: цены из price_list.csv, считает код, не нейросеть.
Позиции «set» для гаража/малой кровли/балкона берутся по отдельной цене (EXTRA_SET)."""
import csv, pathlib

PRICES = {r["code"]: r for r in csv.DictReader(open(pathlib.Path(__file__).with_name("price_list.csv")))}
EXTRA_SET = {"drains": 800, "prep": 300, "cracks_set": 650}  # медианы по второстепенным кровлям
VAT = 0.05


def price(code, section):
    if section == "extra" and code in EXTRA_SET:
        return EXTRA_SET[code]
    return float(PRICES[code]["price_aed"])


def calculate(lines):
    """lines: [(section, code, qty)] → (строки с ценами, subtotal, vat, total)"""
    rows = [(s, c, q, price(c, s), round(q * price(c, s), 2)) for s, c, q in lines]
    subtotal = sum(r[4] for r in rows)
    return rows, subtotal, round(subtotal * VAT, 2), round(subtotal * (1 + VAT), 2)
