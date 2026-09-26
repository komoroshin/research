"""Прогоняем 10 реальных КП через калькулятор: тот же состав работ и объёмы, но цены из прайса."""
from quotes_dataset import QUOTES
from calc import calculate

errs = []
print(f"{'КП':32} {'реально':>9} {'калькулятор':>12} {'разница':>8}")
for name, q in QUOTES.items():
    real = sum(n * p for _, _, n, _, p in q["lines"])
    _, sub, _, _ = calculate([(s, c, n) for s, c, n, _, _ in q["lines"]])
    d = (sub - real) / real * 100
    errs.append(abs(d))
    print(f"{name:32} {real:>9,.0f} {sub:>12,.0f} {d:>+7.1f}%")
print(f"\nСредняя абсолютная ошибка: {sum(errs)/len(errs):.1f}%   максимум: {max(errs):.1f}%   "
      f"в пределах ±5%: {sum(e <= 5 for e in errs)}/10   ±10%: {sum(e <= 10 for e in errs)}/10")
