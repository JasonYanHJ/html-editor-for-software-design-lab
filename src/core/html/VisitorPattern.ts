import { TagNode } from "./TagNode";
import { TextNode } from "./TextNode";

export interface Visitor<T> {
  visitTagNode(tagNode: TagNode): T;
  visitTextNode(textNode: TextNode): T;
}

export interface Component {
  accept<T>(visitor: Visitor<T>): T;
}
