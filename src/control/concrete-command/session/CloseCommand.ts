import { Command } from "@control/Command";
import { Session } from "@core/Session";
import { IO } from "@io/IO";

export class CloseCommand extends Command {
  session: Session;
  io: IO;
  constructor(session: Session, io: IO) {
    super();
    this.session = session;
    this.io = io;
  }

  async execute(): Promise<void> {
    if (!this.session.activeEditor) throw Error("No active edtior to close.");

    if (this.session.activeEditor.isModified()) {
      const answer = await this.io.require(
        `Save changes of file ${this.session.activeEditor.filepath} ? [y/n]`,
        ["y", "n"]
      );
      if (answer === "y") await this.session.activeEditor.save();
    }

    this.session.closeActiveEditor();
  }
}
