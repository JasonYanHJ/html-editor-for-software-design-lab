import { Decorator } from "./Decorator";
import { NodeToPrintableAdapter } from "../node/NodeToPrintableAdapter";
import { TextNode } from "@core/html/TextNode";
import { Printable } from "@service/printer/Printer";
import { SpellCheckService } from "@service/spell-check/SpellCheckService";

export class SpellCheckDecorator extends Decorator<NodeToPrintableAdapter> {
  checker: SpellCheckService;
  constructor(adapter: NodeToPrintableAdapter, checker: SpellCheckService) {
    super(adapter);
    this.checker = checker;
  }

  getChildren(): Printable[] {
    return this.wrappedPrintable
      .getChildren()
      .map((c) => new SpellCheckDecorator(c, this.checker));
  }

  async getContent(): Promise<string> {
    const suffix = (await this.spellError()) ? " [X]" : "";
    return this.wrappedPrintable.getContent() + suffix;
  }

  async spellError() {
    const node = this.wrappedPrintable.node;
    if (node instanceof TextNode)
      return (await this.checker.check(node.content)).length > 0;
    else return false;
  }
}
