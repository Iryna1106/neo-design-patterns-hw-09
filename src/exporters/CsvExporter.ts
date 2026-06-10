import { DataExporter } from "./DataExporter";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const OUTPUT_PATH = "dist/users.csv";

export class CsvExporter extends DataExporter {
  protected render(): string {
    const header = "id,name,email,phone";
    const rows = this.data.map(
      (user) => `${user.id},${user.name},${user.email},${user.phone}`
    );
    return [header, ...rows].join("\n");
  }

  protected save(): void {
    const dir = dirname(OUTPUT_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(OUTPUT_PATH, this.result, "utf-8");
    console.log(`✅ CSV збережено: ${OUTPUT_PATH}`);
  }
}
