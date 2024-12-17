import { Command } from "@control/Command";
import { Session } from "@core/Session";
import { IO } from "@io/IO";
import { writeFileSync } from "fs";
import { CloseCommand } from "./CloseCommand";

export const SESSION_CONFIG_FILENAME = ".my_html_session_config";
export interface SessionCofig {
  active: string | null;
  editors: {
    filepath: string;
    showId: boolean;
  }[];
}

export class ExitCommand extends Command {
  session: Session;
  io: IO;
  constructor(session: Session, io: IO) {
    super();
    this.session = session;
    this.io = io;
  }

  async execute(): Promise<void> {
    this.saveConfig();
    await this.closeAll();
    this.io.printLine("Goodbye!");
    process.exit(0);
  }

  saveConfig() {
    const config: SessionCofig = {
      active: this.session.activeEditor?.filepath ?? null,
      editors: this.session.editors.map((e) => ({
        filepath: e.filepath,
        showId: e.showId,
      })),
    };
    writeFileSync(SESSION_CONFIG_FILENAME, JSON.stringify(config));
  }

  async closeAll() {
    while (this.session.activeEditor) {
      await new CloseCommand(this.session, this.io).execute();
    }
  }
}
