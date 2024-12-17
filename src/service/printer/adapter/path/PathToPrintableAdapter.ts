import { Printable } from "@service/printer/Printer";
import { readdirSync, statSync } from "fs";
import { basename, join } from "path";

export class PathToPrintableAdapter implements Printable {
  filepath: string;
  constructor(filepath: string) {
    this.filepath = filepath;
  }

  getChildren(): PathToPrintableAdapter[] {
    if (statSync(this.filepath).isDirectory()) {
      return readdirSync(this.filepath).map(
        (name) => new PathToPrintableAdapter(join(this.filepath, name))
      );
    } else return [];
  }
  getContent(): string {
    return basename(this.filepath);
  }
  getStartContent(): string {
    return basename(this.filepath);
  }
  getEndContent(): string | null {
    return null;
  }
}
