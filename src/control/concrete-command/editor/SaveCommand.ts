import { Command } from "@control/Command";
import { Editor } from "@core/Editor";

export class SaveCommand extends Command {
  editor: Editor;
  constructor(editor: Editor) {
    super();
    this.editor = editor;
  }

  async execute(): Promise<void> {
    return this.editor.save();
  }
}
