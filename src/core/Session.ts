import { Editor } from "./Editor";

export class Session {
  editors: Editor[] = [];
  activeEditor?: Editor;

  loadEditor(editor: Editor) {
    this.editors.push(editor);
    this.activeEditor = editor;
  }

  switchEditor(filepath: string) {
    const editor = this.editors.find((e) => e.filepath === filepath);
    if (!editor) throw Error(`Editor with filepath ${filepath} not found.`);

    this.activeEditor = editor;
  }

  closeActiveEditor() {
    if (!this.activeEditor) throw Error("No active editor to close.");

    const filepath = this.activeEditor.filepath;
    this.editors = this.editors.filter((e) => e.filepath !== filepath);
    this.activeEditor = this.editors[0];
  }
}
