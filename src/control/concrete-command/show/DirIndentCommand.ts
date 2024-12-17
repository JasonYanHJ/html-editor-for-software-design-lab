import { Command } from "@control/Command";
import { Session } from "@core/Session";
import { IO } from "@io/IO";
import { ModifiedFileDecorator } from "@service/printer/adapter/decorator/ModifiedFileDecorator";
import { PathToPrintableAdapter } from "@service/printer/adapter/path/PathToPrintableAdapter";
import { Printer } from "@service/printer/Printer";

export class DirIndentCommand extends Command {
  session: Session;
  printer: Printer;
  io: IO;
  indent: number;
  constructor(session: Session, printer: Printer, io: IO, indent: number) {
    super();
    this.session = session;
    this.printer = printer;
    this.io = io;
    this.indent = indent;
  }

  async execute(): Promise<void> {
    const result = await this.printer.asIndent(
      new ModifiedFileDecorator(
        new PathToPrintableAdapter(process.cwd()),
        this.session
      ),
      this.indent
    );
    result.forEach((line) => this.io.printLine(line));
  }
}
