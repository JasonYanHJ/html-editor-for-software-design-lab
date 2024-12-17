import { Command } from "@control/Command";
import { Editor } from "@core/Editor";
import { IO } from "@io/IO";
import { NodeToPrintableAdapter } from "@service/printer/adapter/node/NodeToPrintableAdapter";
import { Printer } from "@service/printer/Printer";

export class PrintIndentCommand extends Command {
  editor: Editor;
  printer: Printer;
  io: IO;
  indent: number;
  constructor(editor: Editor, printer: Printer, io: IO, indent: number) {
    super();
    this.editor = editor;
    this.printer = printer;
    this.io = io;
    this.indent = indent;
  }

  async execute(): Promise<void> {
    const result = await this.printer.asIndent(
      new NodeToPrintableAdapter(this.editor.document.root, this.editor.showId),
      this.indent
    );
    result.forEach((line) => this.io.printLine(line));
  }
}
