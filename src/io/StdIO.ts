import { IO } from "./IO";
import * as readline from "node:readline/promises";

export class StdIO extends IO {
  prompt: string;
  constructor(prompt: string = "") {
    super();
    this.prompt = prompt;
  }

  printLine(line: string): void {
    console.log(line);
  }
  async readLine(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const input = await rl.question(this.prompt);
    rl.close();
    return input;
  }
}
