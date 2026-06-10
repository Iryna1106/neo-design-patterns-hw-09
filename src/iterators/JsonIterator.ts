import { readFileSync } from "fs";
import { UserData } from "../data/UserData";

export class JsonIterator implements Iterable<UserData> {
  private users: UserData[];

  constructor(path: string) {
    const content = readFileSync(path, "utf-8");
    this.users = JSON.parse(content) as UserData[];
  }

  *[Symbol.iterator](): Iterator<UserData> {
    yield* this.users;
  }
}
