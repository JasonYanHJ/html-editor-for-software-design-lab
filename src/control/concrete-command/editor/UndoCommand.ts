import { Command } from "@control/Command";
import { Editor } from "@core/Editor";

export class UndoCommand extends Command {
  editor: Editor;
  constructor(editor: Editor) {
    super();
    this.editor = editor;
  }

  async execute(): Promise<void> {
    this.editor.records.undo();
  }
}
