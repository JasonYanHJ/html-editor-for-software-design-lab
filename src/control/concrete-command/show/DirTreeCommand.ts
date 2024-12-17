import { Command } from "@control/Command";
import { Session } from "@core/Session";
import { IO } from "@io/IO";
import { ModifiedFileDecorator } from "@service/printer/adapter/decorator/ModifiedFileDecorator";
import { PathToPrintableAdapter } from "@service/printer/adapter/path/PathToPrintableAdapter";
import { Printer } from "@service/printer/Printer";

export class DirTreeCommand extends Command {
  session: Session;
  printer: Printer;
  io: IO;
  constructor(session: Session, printer: Printer, io: IO) {
    super();
    this.session = session;
    this.io = io;
    this.printer = printer;
  }

  async execute(): Promise<void> {
    const result = await this.printer.asTree(
      new ModifiedFileDecorator(
        new PathToPrintableAdapter(process.cwd()),
        this.session
      )
    );
    result.forEach((line) => this.io.printLine(line));
  }
}
