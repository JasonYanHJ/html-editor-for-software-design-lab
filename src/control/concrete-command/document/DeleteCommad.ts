import { Command } from "@control/Command";
import { Document } from "@core/Document";
import { TagNode } from "@core/html/TagNode";

export class DeleteCommand extends Command {
  document: Document;
  id: string;
  deletedNode?: TagNode;
  parentNode?: TagNode;
  index?: number;
  constructor(document: Document, id: string) {
    super();
    this.document = document;
    this.id = id;
  }

  async execute(): Promise<void> {
    this.deletedNode = this.document.findById(this.id);
    this.parentNode = this.deletedNode?.parent;
    this.index = this.parentNode?.indexOf(this.id);
    this.document.delete(this.id);
  }

  async undo(): Promise<void> {
    this.document.insert(this.parentNode!.id, this.deletedNode!, this.index!);
  }
}
