import { DataExporter } from "./DataExporter";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const OUTPUT_PATH = "dist/users.xml";

export class XmlExporter extends DataExporter {
  protected render(): string {
    const usersXml = this.data
      .map(
        (user) =>
          `  <user>\n` +
          `    <id>${user.id}</id>\n` +
          `    <name>${user.name}</name>\n` +
          `    <email>${user.email}</email>\n` +
          `    <phone>${user.phone}</phone>\n` +
          `  </user>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<users>\n${usersXml}\n</users>`;
  }

  /** Перевизначений hook: додає коментар про час генерації у кінець XML. */
  protected afterRender(): void {
    this.result += `\n<!-- Експорт згенеровано: ${new Date().toISOString()} -->`;
  }

  protected save(): void {
    const dir = dirname(OUTPUT_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(OUTPUT_PATH, this.result, "utf-8");
    console.log(`✅ XML збережено: ${OUTPUT_PATH}`);
  }
}
