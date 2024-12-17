import { Command } from "@control/Command";
import { Session } from "@core/Session";
import { SESSION_CONFIG_FILENAME, SessionCofig } from "./ExitCommand";
import { existsSync, readFileSync } from "fs";
import { CommandFactory } from "@control/CommandFactory";

export class InitSessionCommand extends Command {
  session: Session;
  factory: CommandFactory;
  constructor(session: Session, factory: CommandFactory) {
    super();
    this.session = session;
    this.factory = factory;
  }

  async execute(): Promise<void> {
    if (!existsSync(SESSION_CONFIG_FILENAME)) return;

    const config: SessionCofig = JSON.parse(
      readFileSync(SESSION_CONFIG_FILENAME, { encoding: "utf8" })
    );
    config.editors.forEach(async (e) => {
      await this.factory.create("load", e.filepath).execute();
      this.session.activeEditor!.showId = e.showId;
    });
    config.active && this.session.switchEditor(config.active);
  }
}
