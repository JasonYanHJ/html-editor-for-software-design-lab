import { Command } from "@control/Command";

export class Decorator implements Command {
  protected wrappedCommand: Command;
  constructor(command: Command) {
    this.wrappedCommand = command;
  }

  async execute() {
    this.wrappedCommand.execute();
  }

  async undo() {
    this.wrappedCommand.undo();
  }
}
