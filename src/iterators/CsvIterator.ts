import { readFileSync } from "fs";
import { UserData } from "../data/UserData";

export class CsvIterator implements Iterable<UserData> {
  private users: UserData[];

  constructor(path: string) {
    const content = readFileSync(path, "utf-8").trim();
    const lines = content.split("\n");

    // Перший рядок — заголовок (id,name,email,phone), решта — дані.
    this.users = lines
      .slice(1)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [id, name, email, phone] = line.split(",");
        return { id: Number(id), name, email, phone };
      });
  }

  *[Symbol.iterator](): Iterator<UserData> {
    yield* this.users;
  }
}
