import { Command } from "@control/Command";
import { Document } from "@core/Document";
import { TagNode } from "@core/html/TagNode";

export class EditTextCommand extends Command {
  document: Document;
  id: string;
  newText: string;
  tagNode?: TagNode;
  oldText?: string;
  constructor(document: Document, id: string, newText: string) {
    super();
    this.document = document;
    this.id = id;
    this.newText = newText;
  }

  async execute(): Promise<void> {
    this.tagNode = this.document.findById(this.id);
    if (!this.tagNode) throw Error(`Node with id ${this.id} not found.`);
    this.oldText = this.tagNode.textNode?.content;
    this.tagNode.setText(this.newText);
  }

  async undo(): Promise<void> {
    this.tagNode!.setText(this.oldText);
  }
}
