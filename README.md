# neo-design-patterns-hw-09 — Шаблонний метод + Ітератор

Дві поведінкові частини на одних даних користувачів:

1. **Експорт** користувацької статистики у формати **CSV**, **JSON**, **XML** —
   патерн **Template Method (Шаблонний метод)**.
2. **Обхід** збережених файлів — патерн **Iterator (Ітератор)**.

Дані завантажуються з API [`https://jsonplaceholder.typicode.com/users`](https://jsonplaceholder.typicode.com/users),
з кожного запису відбираються поля `id`, `name`, `email`, `phone`, результат сортується
за іменем і зберігається у трьох форматах.

## Частина 1. Шаблонний метод (експорт)

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

## Частина 2. Ітератор (обхід файлів)

Три ітератори для послідовного обходу збережених файлів. Кожен **самостійно відкриває та
парсить** свій файл у конструкторі й реалізує `[Symbol.iterator](): Iterator<UserData>`
через генератор, тож сумісний із `for...of`:

| Клас | Джерело | Парсинг |
| --- | --- | --- |
| `CsvIterator` | `dist/users.csv` | розбір рядків по комах (пропускаючи заголовок) |
| `JsonIterator` | `dist/users.json` | `JSON.parse` |
| `XmlIterator` | `dist/users.xml` | `fast-xml-parser` |

```ts
for (const user of new CsvIterator("./dist/users.csv")) {
  console.log(user); // { id, name, email, phone }
}
```

Логіка читання та парсингу інкапсульована всередині ітератора — споживач працює лише з
послідовністю об'єктів `UserData`.

## Структура проєкту

```
/
└── src/
    ├── exporters/
    │   ├── DataExporter.ts     # Базовий клас із шаблонним методом export()
    │   ├── CsvExporter.ts      # Експорт у CSV
    │   ├── JsonExporter.ts     # Експорт у JSON
    │   └── XmlExporter.ts      # Експорт у XML (+ afterRender)
    ├── iterators/
    │   ├── CsvIterator.ts      # Ітератор по CSV
    │   ├── JsonIterator.ts     # Ітератор по JSON
    │   └── XmlIterator.ts      # Ітератор по XML
    ├── data/
    │   └── UserData.ts         # Тип даних користувача
    ├── main.ts                 # Демонстрація експорту
    └── main-iterate.ts         # Демонстрація ітераторів
```

## Встановлення

```bash
npm install
```

> Директорію `node_modules/` додано до `.gitignore` — залежності не потрапляють у репозиторій.

## Запуск

**1. Експорт** — генерує файли у `dist/`:

```bash
npx ts-node ./src/main.ts
```

**2. Обхід ітераторами** — читає згенеровані файли і виводить користувачів:

```bash
npx ts-node ./src/main-iterate.ts
```

> На диску Windows у WSL, де `npx ts-node` не запускається (npm не може створити симлінк
> `.bin/ts-node`), використовуйте `node -r ts-node/register ./src/main.ts`
> (аналогічно для `main-iterate.ts`).

## Очікуваний результат

Після `main.ts` у `dist/` створюються три файли:

**`dist/users.csv`**

```text
id,name,email,phone
5,Chelsey Dietrich,Lucio_Hettinger@annie.ca,(254)954-1289
...
```

**`dist/users.json`** — масив об'єктів `{ id, name, email, phone }`.

**`dist/users.xml`** — `<users><user>…</user></users>` + коментар про час генерації.

Після `main-iterate.ts` у консоль виводяться об'єкти `UserData` по одному на ітерацію
для кожного формату (секції `--- CSV ---`, `--- JSON ---`, `--- XML ---`).

## Технології

- TypeScript (strict)
- ts-node
- node-fetch — завантаження даних з API
- fast-xml-parser — парсинг XML в ітераторі
