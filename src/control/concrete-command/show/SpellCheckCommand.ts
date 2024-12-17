import { Command } from "@control/Command";
import { Editor } from "@core/Editor";
import { TagNode } from "@core/html/TagNode";
import { IO } from "@io/IO";
import { SpellCheckService } from "@service/spell-check/SpellCheckService";

export class SpellCheckCommand extends Command {
  editor: Editor;
  io: IO;
  checker: SpellCheckService;
  constructor(editor: Editor, io: IO, checker: SpellCheckService) {
    super();
    this.editor = editor;
    this.io = io;
    this.checker = checker;
  }

  async execute(): Promise<void> {
    const results = await this.checkNode(this.editor.document.root);

    if (results.length > 0) results.forEach((r) => this.io.printLine(r));
    else this.io.printLine("No spelling errors found");
  }

  async checkNode(node: TagNode): Promise<string[]> {
    const result = node.text ? await this.checker.check(node.text) : [];
    const childrenResults = await Promise.all(
      node.childTagNodes.map((c) => this.checkNode(c))
    );
    return [
      ...result.map((s) => `#${node.id}: ${s}`),
      ...childrenResults.flat(),
    ];
  }
}
