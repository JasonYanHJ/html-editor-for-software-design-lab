export abstract class Command {
  async execute(): Promise<void> {}
  async undo(): Promise<void> {}
}
