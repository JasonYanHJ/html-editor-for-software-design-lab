import { Command } from "@control/Command";
import { Document } from "@core/Document";
import { TagNode } from "@core/html/TagNode";

export class InsertCommand extends Command {
  document: Document;
  tag: string;
  newId: string;
  siblingId: string;
  text: string | undefined;
  constructor(
    document: Document,
    tag: string,
    newId: string,
    siblingId: string,
    text: string | undefined
  ) {
    super();
    this.document = document;
    this.tag = tag;
    this.newId = newId;
    this.siblingId = siblingId;
    this.text = text;
  }

  async execute(): Promise<void> {
    const tagNode = new TagNode(this.tag, this.newId);
    tagNode.setText(this.text);

    // 使用现有Core功能的组合来实现新的命令
    const siblingNode = this.document.findById(this.siblingId);
    if (!siblingNode) throw Error(`Node with id ${this.siblingId} not found.`);
    if (!siblingNode.parent) throw Error(`Cannot insert before root node.`);
    this.document.insert(
      siblingNode.parent.id,
      tagNode,
      siblingNode.parent.indexOf(this.siblingId)!
    );
  }

  async undo(): Promise<void> {
    this.document.delete(this.newId);
  }
}
