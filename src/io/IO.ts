export abstract class IO {
  abstract printLine(line: string): void;
  abstract readLine(): Promise<string>;

  async require(message: string, valid: string[]): Promise<string> {
    this.printLine(message);
    while (true) {
      const input = await this.readLine();
      if (valid.includes(input)) return input;
      else this.printLine("Invalid input, please try again.");
    }
  }
}
