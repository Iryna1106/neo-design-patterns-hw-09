import fetch from "node-fetch";
import { UserData } from "../data/UserData";

const API_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * Базовий клас патерну «Шаблонний метод».
 *
 * Метод `export()` задає фіксовану послідовність кроків алгоритму експорту
 * і не містить умовних гілок. Сталі етапи (`load`, `transform`) реалізовано тут,
 * варіативні (`render`, `save`) — абстрактні й перекриваються у підкласах,
 * а `beforeRender` / `afterRender` — hook-методи з порожньою реалізацією.
 */
export abstract class DataExporter {
  protected data: UserData[] = [];
  protected result: string = "";

  /** Шаблонний метод: викликає кроки у фіксованому порядку. */
  public async export(): Promise<void> {
    await this.load();        // 1. завантаження
    this.transform();         // 2. підготовка даних
    this.beforeRender();      // 3. hook перед форматуванням
    this.result = this.render(); // 4. форматування
    this.afterRender();       // 5. hook після форматування
    this.save();              // 6. збереження
  }

  /** Крок 1. Завантаження користувачів з API. */
  protected async load(): Promise<void> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(
        `Не вдалося завантажити дані: ${response.status} ${response.statusText}`
      );
    }
    this.data = (await response.json()) as UserData[];
  }

  /** Крок 2. Відбір лише потрібних полів і сортування за іменем. */
  protected transform(): void {
    this.data = this.data
      .map(({ id, name, email, phone }) => ({ id, name, email, phone }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Hook. Порожня реалізація за замовчуванням. */
  protected beforeRender(): void {}

  /** Hook. Порожня реалізація за замовчуванням. */
  protected afterRender(): void {}

  /** Крок 4. Форматування у цільовий формат. */
  protected abstract render(): string;

  /** Крок 6. Збереження результату у відповідний файл. */
  protected abstract save(): void;
}
