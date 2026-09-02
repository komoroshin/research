# ic14 · Проверка макроцифр по электричеству для дата-центров (02.09.2026)

Назначение: подтвердить по первоисточникам цифры для слайда «Мир строит ИИ —
и упирается в розетку» вижн-деки. Проверяющий читал PDF IEA и LBNL; сайт
iea.org отдаёт 403, поэтому ссылки на PDF в blob-хранилище IEA.

| Утверждение | Проверенная цифра | Источник | Статус |
|---|---|---|---|
| IEA «Energy and AI» (апр. 2025): мир, ДЦ 2024 | ~415 TWh, ~1,5% мирового потребления (стр. 63) | https://iea.blob.core.windows.net/assets/dd7c2387-2f60-4b60-8c5f-6563b6aa1e4c/EnergyandAI.pdf | подтверждено |
| IEA 2025: прогноз 2030, Base Case | ~945 TWh, «чуть менее 3%» мирового потребления; рост ~15%/год (стр. 14, 63) | тот же PDF | подтверждено |
| IEA 2025: доля ДЦ в приросте мирового спроса до 2030 | «less than 10% of the growth» — говорить «менее 10%», не «около» | тот же PDF | уточнено |
| IEA 2025: США | «data centres account for nearly half of electricity demand growth between now and 2030» (стр. 14) | тот же PDF | подтверждено |
| LBNL (20.12.2024): США 2023 | 176 TWh = 4,4% потребления США | https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf | подтверждено |
| LBNL: США 2028 | 325–580 TWh = 6,7–12,0% (74–132 GW при 50% загрузке) | тот же PDF | подтверждено |
| IEA «Key Questions on Energy and AI» (2026) | 485 TWh (2025) → 950 TWh (2030), ~3% мирового спроса; ДЦ — «slightly less than 10%» прироста; ближайшие годы ограничены узкими местами цепочки поставок (стр. 10, 24) | https://iea.blob.core.windows.net/assets/3179f7f8-01f6-4dd6-bffa-c9f7b73f1dc9/KeyQuestionsonEnergyandAI.pdf | подтверждено (новейший IEA) |
| IEA «Electricity 2026»: ДЦ ≈ 50% прироста спроса США, +420 TWh за 5 лет | видно только в сниппетах, страница 403 | https://www.iea.org/reports/electricity-2026/demand | не подтверждено по первоисточнику |
| EPRI «Powering Intelligence 2026» (26.02.2026) | США 2024: 177–192 TWh (4–5%); 2030: ~380–790 TWh = 9–17% | https://www.epri.com/about/media-resources/press-release/trb5wwt7oemdbkaamxrccqkq2ktteae8 ; TWh — https://www.datacenterknowledge.com/build-design/epri-report-us-data-center-grid-strain-casts-cloud-over-ai-race | подтверждено (TWh — по вторичному) |
| Capex гиперскейлеров 2026 | IEA: анонсировано +75% — 715 млрд $, больше всех инвестиций в энергетику США (<600 млрд в 2024), стр. 18. CNBC 06.02.2026: «nearly $700 billion» у четвёрки; CNBC 28.07.2026: guidance повышены | IEA PDF выше; https://www.cnbc.com/2026/02/06/google-microsoft-meta-amazon-ai-cash.html ; https://www.cnbc.com/2026/07/28/hyperscalers-face-higher-capex-scrutiny-after-alphabet-report-panned.html | подтверждено |

Не нашёл: обновлений LBNL / Grid Strategies 2026 по ДЦ.

**Вывод для слайда.** Самая сильная и безопасная цифра — IEA: потребление
дата-центров удваивается, ~415 TWh (2024) → ~950 TWh (2030), и она устояла
в обновлении 2026 года (485 → 950). Вторым ярусом для США: «почти половина
прироста спроса до 2030». Не говорить «10% мирового прироста» без слова
«менее»; не смешивать EPRI 17% (2030) с LBNL 12% (2028) — разные горизонты
и методики.
