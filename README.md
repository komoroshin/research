# Research

Репозиторий сайтов, исследовательских каталогов и браузерных игр Константина Морошина.

Сайт: https://komoroshin.github.io/research/

Инструкции для Codex: [AGENTS.md](AGENTS.md).

## Где работать

| Раздел | Исходники | Страница сайта |
|---|---|---|
| Главная | `index.html` | `/research/` |
| Библиотека AI-кейсов | `ai-case-library/src/` | `/research/cases/` |
| Клиентский каталог | `ai-case-library/client-app/` | `/research/catalog/` |
| Проекты клиентского масштаба | `ai-case-library/scale-app/` | `/research/projects/` |
| Каталог решений | `ai-case-library/solutions-app/` | `/research/solutions/` |
| Лендинги дебиторки | `debitorka/`, включая `opt/`, `ohrana/`, `klining/` | `/research/debitorka/` |
| Герои Эрафии | `games/homm3/` | `/research/games/homm3/` |
| Другие статические материалы | `animaccord/`, `aureum-quote/`, `app/`, `brand/`, `deck/`, `prototype/`, `smoke/` | Соответствующие папки |

В `games/heroes/` и `games/heroes3/` лежат отдельные версии игры.

## Быстрый запуск

Для статических страниц из корня репозитория:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Открыть http://127.0.0.1:8000/ или нужную подпапку, например `/debitorka/` и `/games/homm3/`.

Для внутренней библиотеки (проверено с Node.js 22.22.0 и npm 10.9.4):

```sh
cd ai-case-library
npm ci
npm run dev -- --host 127.0.0.1
```

Для других приложений из той же папки:

```sh
npx vite client-app --host 127.0.0.1
# либо: npx vite scale-app --host 127.0.0.1
# либо: npx vite solutions-app --host 127.0.0.1
```

После изменения исходных данных клиентского каталога или проектов масштаба сначала выполните соответственно `npm run build-client-data` или `npm run build-scale-data`.

Подробности данных, сборки и публикации: [README библиотеки](ai-case-library/README.md).
Механики и инструменты игры: [README игры](games/homm3/README.md).

## Проверки

Из `ai-case-library/`:

```sh
npm run build
npm run build-client
npm run build-scale
npm run build-solutions
npm run validate-data
```

Из корня:

```sh
node games/homm3/test/run.js
```

Браузерные чек-листы `test-ui`, `test-client-ui`, `test-scale-ui`, `test-solutions-ui` ожидают preview на портах 4173, 4174, 4175 и 4176 соответственно. Например, из `ai-case-library/`:

```sh
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
npx vite preview client-app --host 127.0.0.1 --port 4174 --strictPort
npx vite preview scale-app --host 127.0.0.1 --port 4175 --strictPort
npx vite preview solutions-app --host 127.0.0.1 --port 4176 --strictPort
```

Каждый сервер запускается в отдельном терминале. Сейчас тестам дополнительно нужен Playwright (не включён в зависимости), и путь Chromium жёстко задан как `/opt/pw-browsers/chromium`. Для Mac/Windows требуется адаптация тестовой среды.

## Публикация

После сборки соответствующего приложения скрипты из `ai-case-library/` копируют результат:

| Команда | Из | В корне репозитория |
|---|---|---|
| `npm run deploy-pages` | `dist/` | `cases/` |
| `npm run deploy-catalog` | `client-app/dist/` | `catalog/` |
| `npm run deploy-projects` | `scale-app/dist/` | `projects/` |
| `npm run deploy-solutions` | `solutions-app/dist/` | `solutions/` |

Они заменяют локальные каталоги сборки. Доставка на GitHub — отдельный commit/push в ветку, используемую GitHub Pages. Для прямых статических страниц этап сборки не нужен.

## Исходная проверка при переходе в Codex

Проверено 1 октября 2026 на исходном коммите `1973ace`:

- Все четыре React-приложения: TypeScript и production-сборки прошли.
- Основная база: 176 кейсов, структурных ошибок нет, 17 предупреждений о доказательности и возможных дублях. Это не проверка достоверности всех источников.
- Правила игры: 57 тестов прошли, 0 ошибок.
- Браузерные чек-листы и доступность внешних ссылок в этот прогон не проверялись.
- 12 прежних навыков сохранены в `.claude/skills/`; они доступны как материалы проекта. Автоматический импорт навыков не выполнялся.
