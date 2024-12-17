import { TagNode } from "@core/html/TagNode";
import { TextNode } from "@core/html/TextNode";
import { Visitor } from "@core/html/VisitorPattern";

export class TreeContentVisitor implements Visitor<string> {
  showId: boolean;
  RESERVED_TAGS = ["html", "head", "title", "body"];
  constructor(showId: boolean) {
    this.showId = showId;
  }

  visitTagNode(tagNode: TagNode): string {
    if (this.showId && !this.isReserved(tagNode))
      return tagNode.tag + "#" + tagNode.id;
    else return tagNode.tag;
  }
  visitTextNode(textNode: TextNode): string {
    return textNode.content;
  }

  isReserved(tagNode: TagNode) {
    return (
      this.RESERVED_TAGS.includes(tagNode.tag) && tagNode.tag === tagNode.id
    );
  }
}
