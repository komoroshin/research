# IC8-1 · «Stranded megawatts»: брокер/оценщик недоиспользуемой мощности для AI-compute

Дата проверки: 01.09.2026. Роль: скептик. Задача — опровергнуть утверждение:
«Позиция брокера/оценщика stranded MW не занята, конверсии майнинг→AI происходят массово и оплачиваются, в этот сделочный рынок можно войти без капитала и без западных референсов».

---

## 0. Вердикт (коротко)

**Утверждение опровергнуто по 3 из 3 частей — с оговорками.**

1. **«Позиция не занята» — неверно.** Слой сервиса вокруг powered land/конверсий уже плотно заселён: инвестбанки (Evercore, Moelis, PJT, Northland, KBW, B. Riley, Canaccord, Cohen), консультанты по оценке площадок (Altman Solon — именно его Riot нанял оценить 600 МВт Corsicana под AI/HPC), CRE-гиганты с выделенными DC-командами (JLL ~100 человек на powered land, CBRE — часть 6 000-чел. DC-команды, Newmark, C&W), девелоперы-принципалы powered land (Lancium — 4 ГВт в аренде, 15 ГВт пайплайн, инвестиции Blackstone и Nvidia; WiredRE — продал 1 ГВт powered land Google; Soluna; Crusoe), венчурные «искатели скрытых МВт» (GridCARE — $77.5M, Series A $64M в мае 2026; Soma Energy $7M; Niv-AI $12M), нишевые маркетплейсы (Mr. Data Center, QuoteColo, Powered Land, LandGate PowerLeads, datacenterHawk, Bitcoin Mining World, Five 9s Digital). Свободной «белой» ниши не видно; есть лишь очень нижний сегмент (<20 МВт, off-market площадки), где брокеры вроде BMW/QuoteColo уже работают.
2. **«Конверсии массовые и оплачиваются» — половина правды.** Деньги огромные (>$70 млрд контрактов у публичных майнеров по CoinShares), но это **~15 сделок у ~10 продавцов за 30 месяцев (≈6 в год)**, все продавцы — публичные компании с in-house командами и банками. Это не поток — это горстка мегасделок. Посредник-брокер в них нигде не раскрыт; там, где раскрыт — это инвестбанк с fee 0.6–0.7% EV (Moelis: $40–50M на сделке CoreWeave/Core Scientific) или консультант (Altman Solon). Крупнейший «арбитраж» (Galaxy: $65M за Helios → $720M/год аренды от CoreWeave) достался **принципалу**, а не посреднику — и это структурная причина, почему владельцы МВт не хотят делиться upside с брокером.
3. **«Войти без капитала и без западных референсов» — самая слабая часть.** (a) Success fee за поиск/сведение площадок в США = «trading in real estate»: в Техасе требуется лицензия (иначе class A misdemeanor + суд не взыщет вашу комиссию); то же в Альберте/Онтарио (штрафы >$100k), в Швеции — регистрация в FMI под угрозой штрафа/тюрьмы. Success fee за продажу компании/актива — риск «unregistered broker-dealer» (SEC), частично снятый M&A-broker exemption 2023 (но только для private companies с EBITDA <$25M / выручкой <$250M — публичные майнеры не подпадают). (b) Техас SB 17 (в силе с 01.09.2025) запрещает лицам/компаниям из «designated countries» (включая Россию) владеть или **арендовать на ≥1 год** недвижимость; посредник сам не покупает, но контрагенты и их комплаенс будут смотреть на российский след — OFAC в июне 2025 оштрафовал VC-фирму GVA Capital на $216M за работу с российским капиталом, сигнал «gatekeepers» под прицелом. (c) Fluidstack (крупнейший арендатор конверсий) нанимает Site Selection Manager за $200–250k+equity и в вакансии прямо пишет, что «поддерживает отношения с брокерами, землевладельцами и девелоперами» — т.е. покупатель покупает не «оценку», а **доступ к площадкам через доверенных брокеров с трек-рекордом**.

**Что реально осталось (условно живая гипотеза):** не брокер и не «оценщик», а (i) **технический due-diligence-продукт** «AI-readiness площадки» (по 7 критериям Фридмана: firm power ≥100 МВт, Tier III, жидкостное охлаждение/вода, конструктив, dark fiber, capex $8–15M/МВт, кредитоспособный контрагент) как субподряд к Altman Solon/JLL/банкам либо продажа майнерам второго эшелона (Bitdeer, DMG, Soluna, десятки частных 20–100 МВт сайтов), или (ii) работа **вне США** — Нордики/Канада/Парагвай/Залив, где конверсии идут, но где тоже сидят принципалы (Hive, Bitdeer, Phoenix, AiOnX/SWI) и госагентства (Node Pole). Ни один из вариантов не даёт «$10M выручки без капитала» в обозримом горизонте — см. §3.

---

## 1. Сколько конверсий mining→AI/HPC реально состоялось (2024 – авг. 2026)

Реестр подписанных сделок (только binding; LOI отдельно):

| # | Продавец (майнер) | Покупатель | МВт (IT) | TCV | Дата | Посредник раскрыт? |
|---|---|---|---|---|---|---|
| 1 | Core Scientific | CoreWeave | ~590 МВт суммарно | $10.2 млрд / 12 лет (по опциям 2024–нач.2025) | 2024–2025; затем поглощение за ~$9 млрд (2025) | **Moelis** (fin. advisor, fee 0.60–0.70% EV = $40–50M) + **PJT** ($10M) — на M&A. На лизах — не раскрыт |
| 2 | Galaxy Digital (Helios, ex-Argo) | CoreWeave | 800 МВт (всё одобренное) | ~$1 млрд/год ср. за 15 лет; CoreWeave платит $720M/год + 3% эскалатор, NNN | апр. 2025 → июль 2026 (первые 133 МВт сданы) | Не раскрыт. Galaxy — принципал; купил у Argo за $65M в дек. 2022 (дистресс) |
| 3 | Hut 8 (River Bend, LA) | Fluidstack / Anthropic, бэкстоп Google | 245 МВт (+ROFO 1 000 МВт) | $7.0 млрд / 15 лет (до $17.7 млрд) | 17.12.2025 | Не раскрыт. Финансирование: JPM lead, GS, MS ($3.25 млрд IG notes); юристы King & Spalding |
| 4 | Hut 8 (Beacon Point, TX) | «IG-tenant» (не назван) | 2 × 352 МВт | $9.8 + $9.8 = $19.6 млрд (до $25.1 млрд каждый) | 06.05.2026 и 20.07.2026 | Не раскрыт |
| 5 | TeraWulf (Lake Mariner, NY) | Fluidstack, бэкстоп Google $3.2 млрд | 200+ → 360 МВт + JV 168 МВт | ~$3.7 млрд (до $8.7) + CB-5; всего ~$12.8 млрд контрактов | 14–18.08.2025, окт. 2025 | Не раскрыт |
| 6 | Cipher Mining | AWS | 300 МВт | $5.5 млрд / 15 лет | нояб. 2025 | Не раскрыт |
| 7 | Cipher Mining | Fluidstack (Google) | ~168 + 39 МВт | ~$3 млрд (вместе с AWS ~$8.5 млрд) | сент.–нояб. 2025 | Не раскрыт |
| 8 | IREN (Childress, TX) | Microsoft (GPU-cloud, GB300) | 200 МВт IT / кампус 750 МВт | $9.7 млрд / 5 лет; + NVIDIA $3.4 млрд (май 2026) | нояб. 2025 | Не раскрыт |
| 9 | Applied Digital (Ellendale, ND) | CoreWeave | 250 + 150 МВт (+ опцион 150) | ~$7 млрд + ~$5 млрд («гиперскейлер», окт. 2025) | 02.06.2025; окт. 2025 | Не раскрыт; Macquarie — $5 млрд ликвидности |
| 10 | Riot (Rockdale) | AMD | 25 МВт (до 200) | $311M – $1 млрд | 16.01.2026 | Юристы Foley; в 2025 Riot нанял **Evercore + Northland** (fin.) и **Altman Solon** (консалтинг оценки) |
| 11 | Riot (Rockdale) | «frontier AI lab» (CNBC: Anthropic) | 191 МВт | $9.1 млрд / 20 лет (до $16.1) | 10.08.2026 | Не раскрыт; MS — $573M interim financing |
| 12 | CleanSpark (Sandersville, GA) | «IG global tech company» | 175 МВт | $6.6 млрд / 20 лет NNN; + LOI на 885 МВт в Техасе | 14.07.2026 | Не раскрыт |
| 13 | Bitfarms → Keel (Washington) | Контрактор (Vertiv-подобный, $128M) | 18 МВт | capex-контракт, не лиз | 13.11.2025 | — |
| 14 | Genesis Digital Assets → AiOnX/SWI Group | (покупка 77% доли) | 1.3 ГВт (15 сайтов, US+Швеция) | $500M | 15.06.2026 | Не раскрыт |
| 15 | Bitdeer (Clarington, OH) | тенант не объявлен; 570 МВт доступно к Q3 2026 | — | — | — | **Northland** нанят fin. advisor (март 2025) |
| — | MARA | **0 контрактов** на авг. 2026; обещает «≥2 лиза к концу 2026»; JV со Starwood Digital Ventures (SDV ведёт tenant sourcing) | портфель до 4.2–4.8 ГВт | — | — | Starwood = партнёр-принципал, а не брокер |

Итоги:
- **>$70 млрд** объявленных AI/HPC-контрактов у листингованных майнеров (CoinShares, цит. Cointelegraph Magazine, 2026) — «much of the value years out».
- **~15 binding-сделок у ~10 продавцов за ~30 месяцев** → ≈6 сделок/год. По insights4vc (2026): 7 из 11 крупных майнеров подписали «трансформационные» сделки; MARA — «laggard», CleanSpark подписал только в июле 2026.
- **Покупателей — фактически 6**: CoreWeave, Fluidstack (с Google-бэкстопом), AWS, Microsoft, Anthropic (через Fluidstack/напрямую), AMD. Это олигопсония с собственными site-командами.
- **Все продавцы — публичные компании** с CFO, IR и мандатами инвестбанков. Частные майнеры 20–100 МВт в этом реестре отсутствуют — либо продаются целиком как активы (GDA → AiOnX, Rhodium → Riot $185M, Mawson → Singapore fund $8.5M, Greenidge Mississippi → $3.9M, брокер не назван).
- **Ни в одной сделке не раскрыт брокер-посредник** уровня «сведение сторон». Раскрыты только: fin. advisors на M&A (Moelis/PJT), Evercore/Northland/Altman Solon у Riot, Northland у Bitdeer, банки-кредиторы.
- Capex-барьер: mining $0.7–1M/МВт vs AI liquid-cooled $8–15M/МВт (CoinShares). Конверсия — это стройка на миллиарды, где ценность создаётся принципалом.
- Тезис Фридмана («Some Bitcoin Mines can be AI Data Centers; Most Can't», 2026): большинство хэшрейта стоит на дешёвой прерываемой удалённой энергии без fiber/Tier III/воды — **не конвертируемо**. Он же даёт 7 критериев оценки — фактически готовый чек-лист, который и есть «продукт оценщика»; он публичный.

Источники: 
- Core Scientific PR (8-K, 2024–2025): https://investors.corescientific.com/news-events/press-releases/detail/84/… ; DEFM14A 26.09.2025 (Moelis fee 0.60–0.70% EV, PJT $10M): https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001140361-25-036346/ny20053622x1_defm14a.htm ; https://forfairnesssake.substack.com/p/for-fairness-sake-core-scientific
- Galaxy/Helios: https://www.theblock.co/post/407396/… ; https://www.benzinga.com/crypto/cryptocurrency/26/06/60085890/… ; https://www.argoblockchain.com/news-room/2022-december-helios-sale-to-galaxy
- Hut 8 River Bend (17.12.2025): https://www.prnewswire.com/news-releases/hut-8-signs-15-year-245-mw-ai-data-center-lease-at-river-bend-campus-with-total-contract-value-of-7-0-billion-302644600.html ; Beacon Point (май/июль 2026): https://www.prnewswire.com/news-releases/hut-8-fully-commercializes-1-gw-beacon-point-ai-data-center-campus-with-second-352-mw-it-lease-bringing-campus-level-base-term-contract-value-to-19-6-billion-302829514.html ; финансирование: https://www.kslaw.com/about/news/king-spalding-advises-hut-8-on-landmark-river-bend-data-center-project-backed-by-investment-grade-financing
- TeraWulf 8-K (авг. 2025): https://www.sec.gov/Archives/edgar/data/1083301/000110465925079463/tm2523651d3_ex99-1.htm ; https://investors.terawulf.com/news-events/press-releases/detail/121/…
- Cipher/AWS: https://www.coindesk.com/business/2025/11/03/cipher-mining-surges-19-usd5-5b-amazon-web-services-deal ; IREN/Microsoft 8-K: https://www.sec.gov/Archives/edgar/data/1878848/000114036125040072/ef20058139_ex99-1.htm
- Applied Digital/CoreWeave (02.06.2025): https://ir.applieddigital.com/news-events/press-releases/detail/123/…
- Riot/AMD (16.01.2026): https://www.riotplatforms.com/riot-announces-fee-simple-acquisition-of-land-and-first-data-center-lease-with-amd-at-the-rockdale-site/ ; Riot 191 МВт $9.1 млрд (10.08.2026): https://www.sec.gov/Archives/edgar/data/1167419/000110465926093406/riot-20260810xex99d1.htm ; Riot нанял Evercore/Northland/Altman Solon (янв.–фев. 2025): https://www.riotplatforms.com/riot-platforms-launches-formal-evaluation-of-potential-ai-hpc-uses-for-remaining-600-mw-of-power-capacity-at-corsicana-facility/ ; https://www.marketscreener.com/quote/stock/EVERCORE-INC-30993/news/Riot-Platforms-Inc-Engages-Evercore-to-Act-as-Financial-Advisor-49041793/
- CleanSpark (14.07.2026): https://investors.cleanspark.com/news/news-details/2026/CleanSpark-Secures-Twenty-Year-Lease-with-High-Investment-Grade-Global-Technology-Company-for-Data-Center-in-Sandersville-Georgia/default.aspx
- MARA без контракта (авг. 2026): https://www.theblock.co/amp/post/411136/bernstein-favors-cleanspark-on-ai-execution-as-mara-awaits-first-commercial-contract ; MARA–Starwood (26.02.2026): https://ir.mara.com/news-events/press-releases/detail/1416/…
- Bitfarms Washington (13.11.2025): https://investor.bitfarms.com/news-releases/news-release-details/bitfarms-announces-plans-conversion-washington-site-hpcai
- AiOnX/GDA (15.06.2026): https://www.datacenterdynamics.com/en/news/aionx-completes-500m-genesis-digital-assets-deal-will-pivot-crypto-data-centers-to-ai/
- Bitdeer/Northland: https://www.sec.gov/Archives/edgar/data/1899123/000114036125013247/ef20046998_ex99-1.htm
- Rhodium → Riot $185M (28.04.2025): https://www.prnewswire.com/news-releases/riot-platforms-announces-closing-of-the-acquisition-of-rhodium-assets-at-the-rockdale-facility-following-the-previously-announced-settlement-agreement-302440261.html ; Greenidge Mississippi $3.9M (17.09.2025): https://www.businesswire.com/news/home/20250917929642/en
- Сводки: https://cointelegraph.com/magazine/bitcoin-miners-ai-data-centers-power-infrastructure ; https://insights4vc.substack.com/p/bitcoin-minings-ai-pivot-2026-thesis ; https://davefriedman.substack.com/p/some-bitcoin-mines-can-be-ai-data

---

## 2. Кто уже брокерит/оценивает (карта занятости позиции)

**A. Инвестбанки на стороне майнеров (mandate-based, success fee):**
- Evercore (Riot, Corsicana 600 МВт, фев. 2025), Northland Capital Markets (Riot; Bitdeer, март 2025), Moelis (Core Scientific; Bitfarms/Stronghold), PJT (Core Scientific), Cohen & Co (Stronghold), KBW/Stifel, B. Riley, Canaccord, H.C. Wainwright — «advisory and underwriting leadership concentrated among a small group of banks» (Hashrate Index, Top Bitcoin Mining Investment Bankers 2025: https://hashrateindex.com/blog/top-bitcoin-mining-investment-bankers-of-2025/).
- Наблюдаемый fee: Moelis 0.60–0.70% EV ($40–50M) + $2M opinion fee; PJT $10M (DEFM14A 26.09.2025).

**B. Консультанты-оценщики «AI-readiness»:** Altman Solon (нанят Riot), Schneider Electric consulting (site risk 3/6/10 лет), GE Vernova consulting, EPE (Electric Power Engineers), BDO, Kroll, Site Selection Group (+ альянс с hi-tequity, 2025). Источники: https://www.riotplatforms.com/riot-platforms-launches-formal-evaluation-… ; https://blog.se.com/datacenter/2025/02/10/overcoming-power-constraints-smarter-site-selection-data-centers ; https://www.siteselectiongroup.com/

**C. CRE-гиганты:** JLL (~100 человек на powered land; ведёт RFI для «mystery hyperscaler» на 200 акров/400 МВт), CBRE (часть 6 000-чел. DC-команды; «dozens» площадок под контролем; выручка DC-направления +19% — Fortune, 20.05.2026), Newmark, Cushman & Wakefield, Colliers. Источники: https://www.bisnow.com/national/news/data-center-development/powered-land-the-1m-an-acre-asset-fueling-the-data-center-frenzy-132995 (29.01.2026) ; https://www.datacenterdynamics.com/en/news/hyperscaler-seeks-200-acre-site-for-400mw-data-center-in-us/ ; https://fortune.com/2026/05/20/how-the-ai-data-center-boom-has-transformed-the-worlds-largest-commercial-real-estate-company/

**D. Девелоперы-принципалы powered land (они, а не брокеры, «конвертируют stranded MW в AI-ready»):**
- Lancium: 4 ГВт в аренде, 15+ ГВт пайплайн, инвесторы Blackstone + Nvidia (DCD, 2025–26): https://www.datacenterdynamics.com/en/news/nvidia-invests-in-data-center-powered-land-company-lancium/
- WiredRE Development Corp: PREP-программа (01.10.2025) — «openly solicit offers from firms with land and power assets for acquisition or partnership»; продали 1 000 МВт powered land Google (крупнейшая в ERCOT): https://www.businesswire.com/news/home/20251001513255/en/…
- Soluna: 6.3 ГВт пайплайн, JV Kati 2 с Metrobloks (100→350 МВт), выручка Q2 2026 $15.1M (+145% г/г): https://www.solunacomputing.com/news/q2-2026-results/
- Crusoe (принципал, $600M 2024 + $1.375 млрд 2025), Starwood Digital Ventures (JV с MARA — сам ведёт tenant sourcing), Galaxy, AiOnX/SWI.

**E. Стартапы «найти скрытые МВт» (venture-backed):**
- GridCARE: seed $13.5M (май 2025) → Series A $64M (14.05.2026, Sutter Hill, John Doerr, National Grid Partners); >2 ГВт проектов в 12+ рынках; модель — работа с utilities, а не брокеридж: https://www.businesswire.com/news/home/20260514546216/en/…
- Soma Energy (ex-AWS energy team, $7M, 2026): https://www.geekwire.com/2026/startup-launched-by-former-aws-energy-team-emerges-with-7m-to-help-solve-data-center-power-crunch/
- Niv-AI ($12M seed, «unlock trapped capacity» внутри ЦОД): https://www.calcalistech.com/ctechnews/article/bk4zmc8cbe
- Claros ($30M seed), Zendo Energy (€2M) — энергетика ЦОД.
- Рынок «interconnection queue rights» (advisory+brokerage+analytics) оценён в $320M (2025) с CAGR 30% (Marketintelo — отраслевой отчёт низкой надёжности; 44 development-stage активов сменили владельца с янв. 2025 по 5 ISO — Enerdatics): https://www.enerdatics.com/insights/enerdatics-releases-m-a-signals-from-the-queue-mapping-780-gw-in-us-interconnection-queues

**F. Нишевые маркетплейсы/брокеры powered land и майнинг-площадок (уже существуют, мелкие, без раскрытых раундов):**
- Mr. Data Center — «anonymous NDA-first marketplace, 20 МВт–1 ГВт, PJM/ERCOT/NYISO»: https://www.mrdatacenters.com/
- QuoteColo — powered sites/shells/land + «bitcoin mining farms for sale, 50 kW–500+ MW, off-market»: https://www.quotecolo.com/ai-and-hpc-data-center-land/
- Powered Land™ (poweredland.space) — «originates and controls power-adjacent parcels… 1–50 MW, principal options only» (сайт не отвечает при fetch 01.09.2026 — возможно, мёртв; **не нашёл** подтверждения активности)
- LandGate PowerLeads — off-market листинги от землевладельцев + «proprietary offtake capacity data», подписочная модель: https://www.landgate.com/energy-markets/data-centers
- datacenterHawk — аналитика/«Hawk Search» по land/power для брокеров: https://datacenterhawk.com/
- Bitcoin Mining World — «facility acquisitions and dispositions, stranded gas monetization»; fee не раскрыты: https://bitcoinminingworld.com/broker-services
- Five 9s Digital — DC-брокер, продавал майнинг-площадки ещё в 2018 (30 МВт, Murphy NC): https://www.five9sdigital.com/news/five-9s-digital-advises-on-the-sale-of-20-mw-data-center-facility/
- Hashbranch (2022, marketplace хостинга + брокеридж ASIC; партнёрство с DataCenters.com, нояб. 2025), Compass Marketplace (ASIC-ресейл).
- **Раундов/венчурных стадий у маркетплейсов powered land — не нашёл.** Это либо bootstrapped-брокеры, либо подписочная аналитика (LandGate, datacenterHawk).

**Вывод по §2:** позиция «оценщик + сводник stranded MW» занята послойно: банки (мандаты), консультанты (оценка), CRE (сведение), принципалы (конверсия), venture-стартапы (аналитика сети), мелкие брокеры (нижний сегмент). Незанятого «этажа» нет; есть лишь возможность быть субподрядчиком у кого-то из них.

---

## 3. Экономика посредника

**Наблюдаемые ставки (факты):**
- Инвестбанк на M&A майнер↔neocloud: 0.60–0.70% EV (Moelis, $40–50M на $9 млрд) + $10M (PJT) — DEFM14A Core Scientific, 26.09.2025.
- Общий CRE: комиссия за лиз 4–6% от total lease value; за продажу земли 5–10% (платит продавец) — источники общерыночные (listwithclever, metrobi), **не специфичные для ЦОД**.
- **Специфичной ставки для лизов ЦОД/powered land (% или $/кВт) в открытых источниках не нашёл.** Допущение: при TCV $7 млрд (Hut 8) ставка 4–6% дала бы $280–420M — очевидно нереалистично; значит, DC-лизы платят брокеру по капу/за кВт/фиксом. Build.inc (2026): у hyperscale-лиза «minimal ongoing leasing cost» — т.е. брокерские затраты структурно малы.
- Site selection консультанты (GrowthFactor, 2026): project fee $5–50k+, retainer $3–15k/мес., либо комиссия от landlord при подписании; «hybrid flat/performance» (Site Selection Group).
- Powered land бенчмарк цены: Stream Data Centers → Plug Power, 66 акров/164 МВт interconnection, Young County TX: до $76.5M ($50M при закрытии + $26.5M за подтверждённую нагрузку) ≈ **$0.47M/МВт** (thetexaslandagent.com, 2025–26). Bisnow (29.01.2026): powered land $200k–1M/акр против $10–30k до бума; Amazon — 189 акров в Вирджинии за $700M.

**Модельный расчёт «$10M выручки/год» (допущения помечены):**
- Модель А, брокер продажи powered land, 2% от цены (допущение): сделка 164 МВт/$76.5M → $1.5M. Нужно **~7 таких сделок/год** — при ~6 мега-конверсиях/год во всём секторе и при том, что такие сделки уже ведут JLL/CBRE/Newmark.
- Модель Б, success fee $/МВт за сведение лиза (допущение $25–50k/МВт — оценка по аналогии с fee на PPA-origination; **источника нет**): 200 МВт → $5–10M. Нужно 1–2 сделки/год, но это ровно те сделки, где сидят Evercore/Moelis + in-house команды Fluidstack/CoreWeave. Вероятность, что neocloud заплатит внешнему сводчику без лицензии/трек-рекорда, — низкая.
- Модель В, консалтинг оценки «AI-readiness» (fixed fee, допущение $50–150k/площадка по аналогии с project fee site-selection $5–50k+ и техническим DD): нужно **70–200 отчётов/год** — это не «сделочный бизнес», это инженерная консалтинговая фирма с лицензированными инженерами (PE) для utility-взаимодействия.
- **Кто платит:** в CRE — продавец/landlord. В конверсиях — майнер платит банку (Riot→Evercore, Bitdeer→Northland). Покупатели (Fluidstack) держат in-house site selection ($200–250k/год на человека) и работают через брокеров, но платят им как landlord-side комиссию, не как «за оценку».

---

## 4. Спрос: покупают ли гиперскейлеры/neoclouds внешнюю оценку и поиск

- **Fluidstack** (лизы у Hut 8, TeraWulf, Cipher): вакансия Site Selection Manager, $200–238k + equity; обязанности — «maintain relationships with brokers, landowners, and developers so a valid site is never missed», DD 200 МВт+ проектов, «vendor due diligence including on-site audits with specialist engineers», цель — «multiple gigawatts a week by 2030»: https://fluidstack.io/jobs/8d512dcf-e514-47ca-b191-7b0be4f981c4 . Вывод: покупают **доступ к площадкам через брокеров** и **инженерные аудиты у специализированных инженеров** — не «оценку от сделочного посредника».
- **Гиперскейлер через JLL:** RFI на 200 акров/400 МВт вёл JLL от имени неназванного гиперскейлера (DCD, 2025). Bisnow (2026): «These companies are not infrastructure companies… What they really want is just the easy button» — «easy button» дают CRE-гиганты и WiredRE.
- **Публичных RFP на «power-first site selection» не нашёл**; спрос идёт через закрытые RFI брокеров и прямые партнёрства (Starwood–MARA; Macquarie–Applied Digital; Google-бэкстопы).
- Прогноз рынка «Data Center Site Selection and Advisory Services» до $3.17 млрд к 2035 (openPR/маркетинговый отчёт, низкая надёжность) — игроки: CBRE, JLL, C&W, AECOM.

---

## 5. Барьер доступа для команды российского происхождения

**5.1 Лицензии на брокеридж:**
- **Техас (TRELA):** получение комиссии/finder's fee за поиск контрагента по недвижимости (включая коммерческую) требует лицензии брокера/агента; без лицензии — class A misdemeanor, cease-and-desist TREC, суд «likely refuse to enforce your fee agreement». Исключение — некэш-подарок ≤$50. Источники: https://trerc.tamu.edu/article/understanding-real-estate-referrals-in-texas/ ; https://www.trec.texas.gov/can-unlicensed-person-own-real-estate-company-and-receive-all-or-portion-commission-paid-licensed ; https://answers.justia.com/question/2026/05/15/what-agreements-protect-deal-finder-fees-1117954
- **Канада:** Альберта (RECA) — лицензия обязательна; брокеридж не вправе платить referral fee нелицензированному, если его действия = trading in real estate; Онтарио (TRESA) — «shall not trade in real estate»; штрафы >$100k и civil contempt за продолжение: https://www.reca.ca/rules/ ; https://propertymesh.ca/finders-fees/
- **Швеция:** все, кто профессионально посредничает в сделках с недвижимостью/участками, обязаны быть зарегистрированы в FMI; работа без регистрации — штраф или тюрьма: https://fmi.se/in-english/registration/ ; https://verksamt.se/en/industry/find-permits/permit/real-estate-agents-and-real-estate-companies-UKR1933 . Норвегия — **не проверял детально** (eiendomsmegler — лицензируемая профессия; допущение по аналогии).
- **Обход через «power/interconnection rights» вместо земли** — теоретически возможен (продажа прав на подключение как не-real-estate), но в США передача interconnection позиции обычно идёт вместе с землёй/проектной компанией (SPV) → это уже сделка с ценными бумагами → **риск unregistered broker-dealer** (SEC: transaction-based compensation = «hallmark of a salesman»). M&A-broker exemption (Sec. 15(b)(13), в силе с 29.03.2023) снимает риск только для private companies с EBITDA <$25M или выручкой <$250M и запрещает держать средства/финансировать сделку; публичные майнеры не подпадают. Источники: https://www.jonesday.com/en/insights/2023/01/new-law-exempts-ma-brokers-from-sec-registration ; https://www.akerman.com/en/perspectives/many-finders-provide-broker-dealer-services-without-proper-registration.html

**5.2 Санкционный/KYC-контекст:**
- **Texas SB 17** (в силе с 01.09.2025): запрет лицам и компаниям, связанным с «designated countries» (Китай, Россия, Иран, КНДР), владеть (прямо или косвенно, даже частично) или **арендовать ≥1 года** любую недвижимость в Техасе; state jail felony до 2 лет, для организаций — до $250k или половина стоимости имущества. Enforcement — AG; на продавцов обязанность проверки не возложена, но 1) практически все майнинг-конверсии США — Техас (Riot, Cipher, IREN, Galaxy, Core Scientific Denton, MARA, CleanSpark Texas LOI), 2) любой контрагент запросит структуру владения посредника. Источники: https://www.gtlaw.com/en/insights/2025/7/texas-senate-bill-17-restricts-foreign-ownership-of-real-property-in-the-state ; https://www.goodwinlaw.com/en/insights/publications/2025/09/alerts-realestate-pif-texas-foreign-real-estate-ownership
- **OFAC:** BitRiver (РФ-майнинг-хостинг) под санкциями с 20.04.2022 — первый санкционированный майнер; Compass Mining вынужденно бросила ~$30M оборудования в Сибири. GVA Capital — штраф $215.99M (июнь 2025) за управление инвестициями подсанкционного российского лица; OFAC «expects companies to look beyond legal formalities to underlying practical and economic realities». Практика: «expect multiple rejections» от банков при российском следе. Источники: https://therecord.media/us-treasury-dept-sanctions-russian-crypto-mining-giant-bitriver ; https://www.arnoldporter.com/en/perspectives/advisories/2025/06/ofac-hits-venture-capital-firm ; https://terms.law/Invest-USA/countries/russia.html
- **Прецедентов успешного сделочного посредника с РФ-корнями в US powered land — не нашёл.** Прецедент обратный: Compass/BitRiver (разрыв по санкциям). Партнёр с майнингом в РФ в структуре/на сайте = red flag в любом KYC-опроснике американского покупателя (допущение, но с высокой уверенностью с учётом GVA-кейса).

---

## 6. Некролог (2022–2026)

| Кто | Что было | Что случилось | Причина |
|---|---|---|---|
| Compute North (US) | Хостинг/девелопер майнинг-площадок, партнёр Marathon, Compass | Chapter 11, 22.09.2022; долги до $500M, 200+ кредиторов; 363-продажа активов | Нет долгосрочных PPA, рост цен на энергию 2022 при фиксированных хостинг-контрактах |
| Argo Blockchain (Helios, TX) | Строил 180 МВт | Продал Galaxy за $65M (дек. 2022) в дистрессе; тот же актив → $720M/год аренды от CoreWeave (2025–26) | Крипто-зима; иллюстрация, что арбитраж достаётся принципалу с балансом |
| Rhodium (Rockdale) | Хостился у Riot | Банкротство 2024; активы → Riot за $185M (28.04.2025) | Халвинг, дистресс |
| Mawson (TX, GA) | Майнинг-площадки | Техасские сайты → Singapore fund за $8.5M (2023); Sandersville → CleanSpark до $42.5M (2022) | Дистресс, анти-майнинг билль в Техасе |
| Compass Mining (marketplace) | Хостинг-маркетплейс + BitRiver | 3 волны сокращений, отставка CEO/CFO (2022), потеря ~$30M оборудования в РФ | Санкции на BitRiver + собственный дистресс; в 2024–26 стал вертикально-интегрированным оператором (50 МВт в 2024) — маркетплейс-модель де-факто свёрнута в пользу владения |
| Kazakhstan mining | Бум после запрета в КНР 2021 | ~30% легального оборудования покинуло страну; Bit Mining отказался от 100 МВт-проекта; 1 200 МВт «нелегального» майнинга; дефицит 5.7 млрд кВт·ч (2025) | Энергодефицит, налоги, рационирование |
| Bitfarms LatAm | Парагвай 70 МВт | Продан за ≤$30M (янв. 2026), полный выход из ЛатАм; Yguazú 200 МВт → Hive (март 2025) | Перефокус на Северную Америку/AI |
| Powered Land™ (poweredland.space) | Маркетплейс/принципал 1–50 МВт | Сайт не резолвится (01.09.2026) — **не подтверждено**, что закрыт | — |
| **Специализированные маркетплейсы powered land / брокеры stranded power, умершие в крипто-зиму** | — | **Не нашёл** ни одного задокументированного кейса «маркетплейс площадок закрылся». Умирали операторы/хостеры (Compute North, Rhodium, Argo), не брокеры — потому что брокеров-стартапов в этой нише почти не было (нечему было умирать) | — |

Источники: https://www.coindesk.com/business/2022/09/22/crypto-mining-data-center-provider-compute-north-files-for-bankruptcy-protection ; https://hashrateindex.com/blog/compute-north-files-for-chapter-11-bankruptcy-and-363-asset-sale-what-now/ ; https://www.coindesk.com/business/2022/08/08/after-countless-bungles-compass-mining-tries-to-change-its-course ; https://www.datacenterdynamics.com/en/news/report-around-30-percent-of-legal-crypto-mining-equipment-leaves-kazakhstan-due-to-power-shortages-tax-increases/ ; https://www.theblock.co/post/384146/bitfarms-latam-exit-paraguay-sale-north-american-ai-hpc

---

## 7. Альтернативные рынки (вне США)

| Регион | Что происходит | Кто занимает позицию | Свободна ли посредническая ниша |
|---|---|---|---|
| **Канада** | Bitfarms→Keel уходит в США (HQ relocation, фев. 2026); Hut 8 — первая AI-сделка в США; Hive — mixed-use GPU в Квебеке; DMG (BC) — AI-ЦОД к 31.12.2026, конфликт с региональным bylaw; BTC Digital/Aurora — 5–10 МВт off-grid газ в Альберте. Hydro-Québec: майнерам — нет, AI — да, но дороже | Сами майнеры (принципалы), провинциальные utilities | Нишa узкая: провинциальные лицензии на брокеридж; спрос покупателей в Канаде слабее, чем в США (Bitfarms уходит в США) |
| **Нордики** | Hive Boden: 32 МВт, LOI 10 лет с «sovereign Swedish tech company» (25.06.2026); Bitdeer Tydal (Норвегия): 180 МВт под Vera Rubin, готовность дек. 2026; Northern Data — обыски в Boden/Luleå (сент. 2025), налоговые проверки майнеров в Швеции; Phoenix Group (UAE) → Лион 18 МВт | Принципалы + госагентства (Node Pole — «Sweden's leading industrial advisor» для энергоёмких инвесторов, принадлежит Vattenfall/Skellefteå Kraft) | Госагентство даёт site-selection бесплатно; FMI-регистрация обязательна; ниша занята |
| **Парагвай** | Hive: 300→400 МВт на Itaipu, первый GPU-кластер (март 2026), Yguazú куплен у Bitfarms; Bitfarms вышла | Hive (принципал) | Локальная ниша: сведение мелких майнеров (десятки МВт) с покупателями — но покупатели AI-compute в Парагвае почти отсутствуют (латентность/fiber/суверенитет данных). **Не нашёл** ни одной AI-лиз-сделки с внешним тенантом в Парагвае |
| **Залив** | Phoenix Group (Abu Dhabi, IHC): 550 МВт в UAE/Оман/NA/Африка/Европа, план >1 ГВт и $8 млрд, IPO в США; Marathon — 250 МВт JV с Zero Two | Государственные/окологосударственные принципалы | Ниша закрыта суверенными игроками |
| **Казахстан/ЦА** | Отток майнинга (–30% оборудования), дефицит энергии; AI-инфраструктура строится государством и Freedom Holding (100 МВт Tier IV, NVIDIA/Citi меморандум; Alem.Cloud — H200, #86 TOP500); $1.9 млрд хаб «contingent on resolving electricity deficit»; Узбекистан — mining valley с налоговыми льготами до 2035 | Государство, Freedom | **Конверсий майнинг→AI с внешним покупателем не нашёл.** Нет neocloud-спроса; stranded MW отсутствуют — есть дефицит |

Источники: https://cryptobriefing.com/hive-digital-sweden-hpc-colocation-loi/ ; https://www.datacenterdynamics.com/en/news/bitdeer-taps-contractor-to-begin-conversion-of-norwegian-crypto-mine-to-hpc/ ; https://news.bitcoin.com/mining/swedish-tax-scrutiny-shadows-crypto-miners-pivot-to-ai/ ; https://www.datacenterdynamics.com/en/news/the-node-pole-is-acquired-by-swedish-power-companies/ ; https://www.datacenterdynamics.com/en/news/hive-digital-to-expand-hydropowered-yguaz%C3%BA-data-center-in-paraguay-to-400mw/ ; https://www.semafor.com/article/05/14/2026/phoenix-makes-ai-data-center-pivot-into-europe ; https://www.finextra.com/blogposting/32219/… ; https://www.cbc.ca/news/canada/british-columbia/bitcoin-mine-ai-data-centre-9.7229641 ; https://thelogic.co/commentary/quebec-ink/quebec-ai-data-centres-bitcoin-cryptocurrency/

---

## 8. Что могло бы спасти гипотезу (условия фальсификации наоборот)

Гипотеза «сделочного посредника» выживет только если за 8–12 недель подтвердится хотя бы два из трёх:
1. **Платёжеспособный покупатель оценки:** ≥3 письменных подтверждения от neocloud/девелопера (Fluidstack, Nebius, Crusoe, Soluna, WiredRE, Lancium) или от банка/консультанта (Altman Solon, Northland), что они заплатят за внешний AI-readiness DD площадки ≥$50k/объект **или** возьмут субподряд по 7-критериальному скринингу.
2. **Легальная fee-конструкция:** мнение US-юриста, что модель (напр., инженерный fixed-fee + опцион/партнёрство в SPV, а не finder's fee) не требует лицензии брокера в Техасе и не является unregistered broker-dealer; и что KYC контрагентов проходит при полном отсутствии РФ-партнёра в структуре (майнинг-полигон в РФ вынести за периметр юрлица и бренда).
3. **Пул нерепрезентированных продавцов:** список ≥20 частных площадок 20–150 МВт в США/Канаде/Нордиках, у которых нет мандата с банком/CRE и которые письменно готовы платить за оценку/сведение. Если таких <5 — ниша иллюзорна.

Дешёвый первый шаг (≤$5k, 4 недели): (а) 10 звонков: 4 site-selection/энерго-менеджерам neocloud, 3 брокерам DC (JLL/Newmark/Five 9s), 3 частным майнерам 20–100 МВт; (б) юридический memo по TRELA + broker-dealer + SB 17 для конкретной структуры; (в) пилотный 7-критериальный отчёт по одной реальной площадке (не РФ) и попытка продать его хоть за $1.

---

## 9. Ограничения исследования
- Веб-поиск, без доступа к платным базам (PitchBook/Tracxn — только превью). Комиссии по DC-лизам не публикуются — все ставки в §3 помечены как допущения.
- Часть страниц не открылась (QuoteColo — антибот; Mr. Data Center — пустая; poweredland.space — не резолвится; CNBC/ETF Trends — 403).
- Кол-во сделок посчитано по открытым PR/8-K; частные конверсии <20 МВт могли не попасть.
