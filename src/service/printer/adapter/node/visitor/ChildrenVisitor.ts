import { Node } from "@core/html/Node";
import { TagNode } from "@core/html/TagNode";
import { TextNode } from "@core/html/TextNode";
import { Visitor } from "@core/html/VisitorPattern";

export class ChildrenVisitor implements Visitor<Node[]> {
  visitTagNode(tagNode: TagNode): Node[] {
    return tagNode.children;
  }
  visitTextNode(textNode: TextNode): Node[] {
    return [];
  }
}
