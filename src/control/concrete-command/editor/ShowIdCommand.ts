import { Command } from "@control/Command";
import { Editor } from "@core/Editor";

export class ShowIdCommand extends Command {
  editor: Editor;
  showId: boolean;
  constructor(editor: Editor, showId: boolean) {
    super();
    this.editor = editor;
    this.showId = showId;
  }

  async execute(): Promise<void> {
    this.editor.showId = this.showId;
  }
}
