import { Command } from "@control/Command";
import { Session } from "@core/Session";
import { IO } from "@io/IO";

export class EditorListCommand extends Command {
  session: Session;
  io: IO;
  constructor(session: Session, io: IO) {
    super();
    this.session = session;
    this.io = io;
  }

  async execute(): Promise<void> {
    this.io.printLine("editors:");
    this.session.editors.forEach((e) => {
      const prefix = this.session.activeEditor === e ? "> " : "  ";
      const suffix = e.isModified() ? " *" : "";
      this.io.printLine(prefix + e.filepath + suffix);
    });
  }
}
