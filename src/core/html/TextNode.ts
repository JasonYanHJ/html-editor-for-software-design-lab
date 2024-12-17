import { Node } from "./Node";
import { Visitor } from "./VisitorPattern";

export class TextNode implements Node {
  content: string;
  constructor(content: string) {
    this.content = content;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTextNode(this);
  }
}
