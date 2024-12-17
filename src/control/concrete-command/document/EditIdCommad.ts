import { Command } from "@control/Command";
import { Document } from "@core/Document";

export class EditIdCommand extends Command {
  document: Document;
  oldId: string;
  newId: string;
  constructor(document: Document, oldId: string, newId: string) {
    super();
    this.document = document;
    this.oldId = oldId;
    this.newId = newId;
  }

  async execute(): Promise<void> {
    this.document.editId(this.oldId, this.newId);
  }

  async undo(): Promise<void> {
    this.document.editId(this.newId, this.oldId);
  }
}
