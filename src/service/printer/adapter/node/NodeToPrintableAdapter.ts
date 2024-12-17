import { Node } from "@core/html/Node";
import { Printable } from "@service/printer/Printer";
import { ChildrenVisitor } from "./visitor/ChildrenVisitor";
import { TreeContentVisitor } from "./visitor/TreeContentVisitor";
import { IndentStartVisitor } from "./visitor/IndentStartVisitor";
import { IndentEndVisitor } from "./visitor/IndentEndVisitor";

export class NodeToPrintableAdapter implements Printable {
  node: Node;
  showId: boolean;
  constructor(node: Node, showId: boolean) {
    this.node = node;
    this.showId = showId;
  }

  getChildren(): NodeToPrintableAdapter[] {
    return this.node
      .accept(new ChildrenVisitor())
      .map((c) => new NodeToPrintableAdapter(c, this.showId));
  }
  getContent(): string {
    return this.node.accept(new TreeContentVisitor(this.showId));
  }
  getStartContent(): string {
    return this.node.accept(new IndentStartVisitor(this.showId));
  }
  getEndContent(): string | null {
    return this.node.accept(new IndentEndVisitor());
  }
}
