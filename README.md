# neo-design-patterns-hw-09 — Патерн «Шаблонний метод»

Експорт користувацької статистики у форматах **CSV**, **JSON** та **XML** із застосуванням
поведінкового патерну **Template Method (Шаблонний метод)**.

Дані завантажуються з API [`https://jsonplaceholder.typicode.com/users`](https://jsonplaceholder.typicode.com/users),
з кожного запису відбираються поля `id`, `name`, `email`, `phone`, після чого
результат сортується за іменем і зберігається у трьох форматах.

## Як працює патерн

Базовий клас `DataExporter` інкапсулює **незмінний алгоритм експорту** у шаблонному
методі `export()`, який викликає кроки у фіксованому порядку й **без жодних умовних гілок**:

| Крок | Метод | Тип | Опис |
| --- | --- | --- | --- |
| 1 | `load()` | сталий | Завантаження користувачів з API |
| 2 | `transform()` | сталий | Відбір полів `id, name, email, phone` + сортування за іменем |
| 3 | `beforeRender()` | **hook** | Порожня реалізація за замовчуванням |
| 4 | `render()` | **abstract** | Форматування у цільовий формат (CSV / JSON / XML) |
| 5 | `afterRender()` | **hook** | Порожня реалізація; `XmlExporter` перевизначає її |
| 6 | `save()` | **abstract** | Запис результату у файл |

Кожен підклас реалізує лише варіативні кроки:

- **`CsvExporter`** — `render()` + `save()` → `dist/users.csv`
- **`JsonExporter`** — `render()` + `save()` → `dist/users.json`
- **`XmlExporter`** — `render()` + `save()` + перевизначений `afterRender()` (додає коментар
  про час генерації у кінець файлу) → `dist/users.xml`

## Структура проєкту

```
/
└── src/
    ├── exporters/
    │   ├── DataExporter.ts     # Базовий клас із шаблонним методом export()
    │   ├── CsvExporter.ts      # Експорт у CSV
    │   ├── JsonExporter.ts     # Експорт у JSON
    │   └── XmlExporter.ts      # Експорт у XML (+ afterRender)
    ├── data/
    │   └── UserData.ts         # Тип даних користувача
    └── main.ts                 # Точка входу для демонстрації
```

## Встановлення

```bash
npm install
```

> Директорію `node_modules/` додано до `.gitignore` — залежності не потрапляють у репозиторій.

## Запуск

```bash
npx ts-node ./src/main.ts
```

Після запуску у директорії `dist/` створюються три файли: `users.csv`, `users.json`, `users.xml`.

## Очікуваний результат

**`dist/users.csv`**

```text
id,name,email,phone
5,Chelsey Dietrich,Lucio_Hettinger@annie.ca,(254)954-1289
10,Clementina DuBuque,Rey.Padberg@karina.biz,024-648-3804
...
```

**`dist/users.json`**

```json
[
  {
    "id": 5,
    "name": "Chelsey Dietrich",
    "email": "Lucio_Hettinger@annie.ca",
    "phone": "(254)954-1289"
  },
  ...
]
```

**`dist/users.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user>
    <id>5</id>
    <name>Chelsey Dietrich</name>
    <email>Lucio_Hettinger@annie.ca</email>
    <phone>(254)954-1289</phone>
  </user>
  ...
</users>
<!-- Експорт згенеровано: 2025-05-12T22:24:31.964Z -->
```

## Технології

- TypeScript (strict)
- ts-node
- node-fetch — завантаження даних з API

---

> **Примітка.** У директорії `src/iterators/` та файлі `src/main-iterate.ts` лежать
> стартові заготовки для окремої частини завдання (ітератори для обходу експортованих
> файлів). Вони не входять до цього завдання й наразі не реалізовані.
