import { TagNode } from "@core/html/TagNode";
import { TextNode } from "@core/html/TextNode";
import { Visitor } from "@core/html/VisitorPattern";

export class IndentEndVisitor implements Visitor<string | null> {
  visitTagNode(tagNode: TagNode): string {
    return `</${tagNode.tag}>`;
  }
  visitTextNode(textNode: TextNode): string | null {
    return null;
  }
}
