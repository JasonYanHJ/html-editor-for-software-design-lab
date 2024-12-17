import { Editor } from "@core/Editor";
import { Decorator } from "./Decorator";
import { Command } from "@control/Command";

export class CanUndoDecorator extends Decorator {
  editor: Editor;
  constructor(command: Command, edtior: Editor) {
    super(command);
    this.editor = edtior;
  }

  async execute(): Promise<void> {
    await this.wrappedCommand.execute();
    this.editor.records.addRecord(this.wrappedCommand);
  }
}
