import { EventMediator } from "@core/event-mediator/EventMediator";
import { Node } from "./Node";
import { TextNode } from "./TextNode";
import { Visitor } from "./VisitorPattern";

export class TagNode implements Node {
  id: string;
  tag: string;
  parent?: TagNode;
  textNode?: TextNode;
  childTagNodes: TagNode[] = [];
  get children(): Node[] {
    return this.textNode
      ? [this.textNode, ...this.childTagNodes]
      : this.childTagNodes;
  }
  get text(): string | undefined {
    return this.textNode?.content;
  }
  constructor(tag: string, id?: string) {
    if (!id && !["html", "head", "title", "body"].includes(tag))
      throw Error("Tag node except [html/head/title/body] must have an id.");
    this.tag = tag;
    this.id = id ?? tag;
  }

  setText(text: string | undefined) {
    const oldText = this.text;
    if (!text) this.textNode = undefined;
    else this.textNode = new TextNode(text);

    EventMediator.getInstance().notify("text-change", {
      oldText,
      newText: text,
    });
  }

  insert(tagNode: TagNode, index?: number) {
    tagNode.parent = this;
    this.childTagNodes.splice(index ?? this.childTagNodes.length, 0, tagNode);
  }

  indexOf(childId: string) {
    const index = this.childTagNodes.findIndex((c) => c.id === childId);
    return index !== -1 ? index : undefined;
  }

  delete(childId: string) {
    const index = this.indexOf(childId);
    if (index === undefined)
      throw Error(`Node with childId ${childId} not found.`);

    this.childTagNodes[index].parent = undefined;
    this.childTagNodes.splice(index, 1);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTagNode(this);
  }
}
