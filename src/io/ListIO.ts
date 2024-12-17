import { IO } from "./IO";

export class ListIO extends IO {
  input: string[];
  output: string[];
  generator: Generator<string, void, unknown>;
  constructor(input: string[], output: string[]) {
    super();
    this.input = input;
    this.output = output;
    this.generator = this.read();
  }

  printLine(line: string): void {
    this.output.push(line);
  }

  readLine(): Promise<string> {
    return new Promise((resolve) => {
      const result = this.generator.next();
      if (!result.done) resolve(result.value);
    });
  }

  *read() {
    for (const line of this.input) yield line;
  }
}
