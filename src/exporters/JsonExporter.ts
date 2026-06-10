import { DataExporter } from "./DataExporter";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const OUTPUT_PATH = "dist/users.json";

export class JsonExporter extends DataExporter {
  protected render(): string {
    return JSON.stringify(this.data, null, 2);
  }

  protected save(): void {
    const dir = dirname(OUTPUT_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(OUTPUT_PATH, this.result, "utf-8");
    console.log(`✅ JSON збережено: ${OUTPUT_PATH}`);
  }
}
