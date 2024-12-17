import { Printer } from "@service/printer/Printer";
import { Document } from "./Document";
import { NodeToPrintableAdapter } from "@service/printer/adapter/node/NodeToPrintableAdapter";
import { writeFileSync } from "fs";
import { CommandRecords } from "./CommandRecords";

export class Editor {
  document: Document;
  filepath: string;
  showId: boolean;
  records: CommandRecords;
  constructor(document: Document, filepath: string, showId: boolean = true) {
    this.document = document;
    this.filepath = filepath;
    this.showId = showId;
    this.records = new CommandRecords();
  }

  isModified() {
    return this.records.isModified();
  }

  async save(): Promise<void> {
    writeFileSync(this.filepath, await this.serialize());
    this.records.save();
  }

  async serialize(): Promise<string> {
    const result = await new Printer().asIndent(
      new NodeToPrintableAdapter(this.document.root, true),
      2
    );
    return result.join("\n");
  }
}
