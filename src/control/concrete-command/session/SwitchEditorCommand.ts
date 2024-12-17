import { Command } from "@control/Command";
import { Session } from "@core/Session";

export class SwitchEditorCommand extends Command {
  session: Session;
  filepath: string;
  constructor(session: Session, filepath: string) {
    super();
    this.session = session;
    this.filepath = filepath;
  }

  async execute(): Promise<void> {
    this.session.switchEditor(this.filepath);
  }
}
