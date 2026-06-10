import { readFileSync } from "fs";
import { UserData } from "../data/UserData";
import { XMLParser } from "fast-xml-parser";

export class XmlIterator implements Iterable<UserData> {
  private users: UserData[];

  constructor(path: string) {
    const content = readFileSync(path, "utf-8");
    const parsed = new XMLParser().parse(content);

    // <users><user>…</user></users>; один <user> парситься як об'єкт, кілька — як масив.
    const raw = parsed?.users?.user ?? [];
    const list = Array.isArray(raw) ? raw : [raw];

    this.users = list.map((u: any) => ({
      id: Number(u.id),
      name: String(u.name),
      email: String(u.email),
      phone: String(u.phone),
    }));
  }

  *[Symbol.iterator](): Iterator<UserData> {
    yield* this.users;
  }
}
