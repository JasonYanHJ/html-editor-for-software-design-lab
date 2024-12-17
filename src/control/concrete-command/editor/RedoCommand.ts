import { Command } from "@control/Command";
import { Editor } from "@core/Editor";

export class RedoCommand extends Command {
  editor: Editor;
  constructor(editor: Editor) {
    super();
    this.editor = editor;
  }

  async execute(): Promise<void> {
    await this.editor.records.redo();
  }
}
