import { Command } from "@control/Command";
import { Editor } from "@core/Editor";
import { IO } from "@io/IO";
import { SpellCheckDecorator } from "@service/printer/adapter/decorator/SpellCheckDecorator";
import { NodeToPrintableAdapter } from "@service/printer/adapter/node/NodeToPrintableAdapter";
import { Printer } from "@service/printer/Printer";
import { SpellCheckService } from "@service/spell-check/SpellCheckService";

export class PrintTreeCommand extends Command {
  editor: Editor;
  printer: Printer;
  io: IO;
  checker: SpellCheckService;
  constructor(
    editor: Editor,
    printer: Printer,
    io: IO,
    checker: SpellCheckService
  ) {
    super();
    this.editor = editor;
    this.io = io;
    this.printer = printer;
    this.checker = checker;
  }

  async execute(): Promise<void> {
    const result = await this.printer.asTree(
      new SpellCheckDecorator(
        new NodeToPrintableAdapter(
          this.editor.document.root,
          this.editor.showId
        ),
        this.checker
      )
    );
    result.forEach((line) => this.io.printLine(line));
  }
}
