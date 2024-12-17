import { Command } from "@control/Command";
import { Document } from "@core/Document";
import { TagNode } from "@core/html/TagNode";

export class AppendCommand extends Command {
  document: Document;
  tag: string;
  newId: string;
  parentId: string;
  text: string | undefined;
  constructor(
    document: Document,
    tag: string,
    newId: string,
    parentId: string,
    text: string | undefined
  ) {
    super();
    this.document = document;
    this.tag = tag;
    this.newId = newId;
    this.parentId = parentId;
    this.text = text;
  }

  async execute(): Promise<void> {
    const tagNode = new TagNode(this.tag, this.newId);
    tagNode.setText(this.text);
    this.document.insert(this.parentId, tagNode);
  }

  async undo(): Promise<void> {
    this.document.delete(this.newId);
  }
}
