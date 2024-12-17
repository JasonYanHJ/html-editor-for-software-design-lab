import { Command } from "@control/Command";
import { Document } from "@core/Document";
import { Editor } from "@core/Editor";
import { Session } from "@core/Session";
import { ParserService } from "@service/parser/ParserService";
import { existsSync, readFileSync, writeFileSync } from "fs";

export class LoadCommand extends Command {
  session: Session;
  parser: ParserService;
  filepath: string;
  constructor(session: Session, parser: ParserService, filepath: string) {
    super();
    this.session = session;
    this.parser = parser;
    this.filepath = filepath;
  }

  async execute(): Promise<void> {
    if (this.session.editors.some((e) => e.filepath === this.filepath))
      throw Error(`File ${this.filepath} is already loaded.`);

    if (existsSync(this.filepath)) this.load();
    else await this.init();
  }

  load() {
    const htmlString = readFileSync(this.filepath, { encoding: "utf8" });
    const document = this.parser.parse(htmlString);
    this.session.loadEditor(new Editor(document, this.filepath));
  }

  async init() {
    writeFileSync(this.filepath, "");
    this.session.loadEditor(new Editor(new Document(), this.filepath));
    await this.session.activeEditor!.save();
  }
}
